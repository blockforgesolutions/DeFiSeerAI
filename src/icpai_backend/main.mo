import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Error "mo:base/Error";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Timer "mo:base/Timer";
import Principal "mo:base/Principal";
import Types "types";

actor TradingBot {
    // HTTP istekleri için tip tanımlamaları
    type HttpRequest = {
        url : Text;
        method : Text;
        body : ?[Nat8];
        headers : [(Text, Text)];
        max_response_bytes : ?Nat64;
    };

    type HttpResponse = {
        body : [Nat8];
        headers : [(Text, Text)];
        status_code : Nat16;
    };

    // IC Management Canister tipi
    type IC = actor {
        http_request : HttpRequestArgs -> async HttpResponsePayload;
    };

    type HttpRequestArgs = {
        url : Text;
        headers : [HttpHeader];
        body : ?[Nat8];
        method : HttpMethod;
    };

    type HttpHeader = {
        name : Text;
        value : Text;
    };

    type HttpMethod = {
        #get;
        #post;
        #head;
    };

    type HttpResponsePayload = {
        status : Nat;
        headers : [HttpHeader];
        body : [Nat8];
    };

    // Veri yapısı
    type ICPData = {
        timestamp: Int;
        price: Float;
        volume: Float;
        change24h: Float;
    };

    private let icpHistory = Buffer.Buffer<ICPData>(1000);
    private let weights = Buffer.Buffer<Float>(5);
    private var bias : Float = 0.0;
    private let learningRate : Float = 0.01;

    let ic : Types.IC = actor("aaaaa-aa");

    // Periyodik işlem için timer ID'si
    private var timerId : Nat = 0;
    private var isRunning : Bool = false;

    // Başlangıç verilerini yükle
    public func loadDataset() : async Text {
        try {
            let host = "min-api.cryptocompare.com";
            let url = "https://" # host # "/data/v2/histoday?fsym=ICP&tsym=USDT&limit=30"; // Son 30 günlük veri
            
            let request_headers = [
                { name = "Host"; value = host },
                { name = "User-Agent"; value = "exchange_rate_canister" },
            ];

            let http_request : Types.HttpRequestArgs = {
                url = url;
                headers = request_headers;
                body = null;
                method = #get;
            };

            Cycles.add(20_949_972_000);

            let response = await ic.http_request(http_request);
            let response_body = Blob.fromArray(response.body);
            
            let decoded_text = switch (Text.decodeUtf8(response_body)) {
                case (null) { return "Yanıt decode edilemedi" };
                case (?text) { 
                    Debug.print("Tarihsel Veri API Yanıtı: " # text);
                    text 
                };
            };

            // Veri setini temizle
            icpHistory.clear();

            // JSON parse et ve verileri ekle
            let data = parseHistoricalData(decoded_text);
            for (item in data.vals()) {
                icpHistory.add(item); // Normalize etmeden ham veriyi kullan
            };

            // Verileri sırala (timestamp'e göre)
            let sortedData = Array.sort(Buffer.toArray(icpHistory), func(a: ICPData, b: ICPData) : {#less; #equal; #greater} {
                if (a.timestamp < b.timestamp) #less
                else if (a.timestamp == b.timestamp) #equal
                else #greater
            });

            // Sıralı verileri buffer'a geri yükle
            icpHistory.clear();
            for (item in sortedData.vals()) {
                icpHistory.add(item);
            };

            // Son verileri debug için yazdır
            for (i in Iter.range(0, Int.min(4, icpHistory.size() - 1))) {
                let data = icpHistory.get(i);
                Debug.print("Veri " # Int.toText(i) # ": Fiyat=" # Float.toText(data.price) # 
                           " USDT, Hacim=" # Float.toText(data.volume) # 
                           ", Zaman=" # Int.toText(data.timestamp));
            };

            return "Gerçek veri seti yüklendi. Toplam " # Nat.toText(icpHistory.size()) # " veri noktası.";
        } catch (e) {
            return "Veri yükleme hatası: " # Error.message(e);
        };
    };

    // Ağırlıkları başlatma
    public func initializeWeights() : async () {
        weights.clear();
        for (i in Iter.range(0, 4)) {
            weights.add(0.1);
        };
        bias := 0.0;
    };

    // Sigmoid aktivasyon fonksiyonu
    private func sigmoid(x : Float) : Float {
        1.0 / (1.0 + Float.exp(-x));
    };

    // ICP verilerini CryptoCompare'den çekme
    public func fetchICPData() : async Result.Result<Text, Text> {
        try {
            let host = "min-api.cryptocompare.com";
            let url = "https://" # host # "/data/price?fsym=ICP&tsyms=USDT";
            
            let request_headers = [
                { name = "Host"; value = host },
                { name = "User-Agent"; value = "exchange_rate_canister" },
            ];

            let http_request : Types.HttpRequestArgs = {
                url = url;
                headers = request_headers;
                body = null;
                method = #get;
            };

            Cycles.add(20_949_972_000);

            let response = await ic.http_request(http_request);
            let response_body = Blob.fromArray(response.body);
            
            let decoded_text = switch (Text.decodeUtf8(response_body)) {
                case (null) { return #err("Yanıt decode edilemedi") };
                case (?text) { 
                    Debug.print("API Yanıtı: " # text);
                    text 
                };
            };

            let price = parseCryptoComparePrice(decoded_text);
            
            // Fiyat kontrolü
            if (price <= 0.0) {
                return #err("Geçersiz fiyat: " # Float.toText(price));
            };

            let newData : ICPData = {
                timestamp = Time.now();
                price = price;
                volume = 1000000.0; // Sabit hacim
                change24h = 0.0;
            };

            icpHistory.add(newData);
            #ok("Fiyat başarıyla eklendi: " # Float.toText(price) # " USDT")

        } catch (err) {
            #err("Veri çekilemedi: " # Error.message(err))
        }
    };

    // Veri normalizasyonu için yardımcı fonksiyonlar
    private func normalizeData(data: ICPData) : ICPData {
        // Fiyat kontrolü
        if (Float.isNaN(data.price) or data.price <= 0.0) {
            return {
                timestamp = data.timestamp;
                price = data.price;  // Ham fiyatı koru
                volume = data.volume;
                change24h = data.change24h;
            };
        };

        // Normalize etme
        return {
            timestamp = data.timestamp;
            price = data.price;  // Fiyatı normalize etme
            volume = if (data.volume > 0.0) data.volume / 10000000.0 else 0.0;
            change24h = data.change24h / 100.0;
        };
    };

    // CryptoCompare JSON parse fonksiyonu
    private func parseCryptoComparePrice(json: Text) : Float {
        Debug.print("Gelen JSON: " # json);

        if (Text.contains(json, #text "\"USDT\":")) {
            let parts = Text.split(json, #text "\"USDT\":");
            switch(parts.next()) {
                case (?_) {
                    switch(parts.next()) {
                        case (?valueText) {
                            let cleanText = Text.trim(valueText, #text " {}\"");
                            Debug.print("Parse edilecek değer: " # cleanText);

                            // Sayısal değer kontrolü
                            var result : Float = 0.0;
                            var decimalPart : Float = 0.0;
                            var isDecimal : Bool = false;
                            var decimalPlace : Float = 0.1;
                            
                            for (c in cleanText.chars()) {
                                if (c == '.') {
                                    isDecimal := true;
                                } else if (c >= '0' and c <= '9') {
                                    let digit = Float.fromInt(Nat32.toNat(Char.toNat32(c) - 48));
                                    if (isDecimal) {
                                        decimalPart += digit * decimalPlace;
                                        decimalPlace := decimalPlace / 10.0;
                                    } else {
                                        result := result * 10.0 + digit;
                                    };
                                };
                            };

                            let finalPrice = result + decimalPart;
                            Debug.print("Hesaplanan fiyat: " # Float.toText(finalPrice));
                            
                            if (finalPrice > 0.0) {
                                return finalPrice;
                            };
                        };
                        case null {};
                    };
                };
                case null {};
            };
        };
        
        Debug.print("Fiyat parse edilemedi!");
        return 0.0;
    };

    // Text'i Float'a çeviren yardımcı fonksiyon
    private func textToFloat(text: Text) : Float {
        var num : Float = 0.0;
        for (c in text.chars()) {
            if (c >= '0' and c <= '9') {
                num := num * 10.0 + Float.fromInt(Nat32.toNat(Char.toNat32(c) - 48));
            };
        };
        return num;
    };

    // Tahmin yapma
    public func predict() : async Float {
        if (icpHistory.size() == 0) return 0.0;
        if (weights.size() == 0) return 0.0; // Weights kontrolü ekle
        
        let currentData = icpHistory.get(icpHistory.size() - 1);
        
        var sum = bias;
        // Weight sayısı kontrolü
        let numWeights = Int.min(3, weights.size());
        
        if (numWeights > 0) sum += currentData.price * weights.get(0);
        if (numWeights > 1) sum += currentData.volume * weights.get(1);
        if (numWeights > 2) sum += currentData.change24h * weights.get(2);

        return sigmoid(sum);
    };

    // Model eğitimi
    public func train() : async () {
        if (icpHistory.size() < 2) return;
        if (weights.size() == 0) await initializeWeights();

        let prediction = await predict();
        let currentData = icpHistory.get(icpHistory.size() - 1);
        let previousData = icpHistory.get(icpHistory.size() - 2);
        
        let target = if (currentData.price > previousData.price) 1.0 else 0.0;
        let error = target - prediction;

        // Ağırlık güncellemesi
        let numWeights = Int.min(3, weights.size());
        for (i in Iter.range(0, numWeights - 1)) {
            let currentWeight = weights.get(i);
            let update = learningRate * error * prediction * (1.0 - prediction);
            weights.put(i, currentWeight + update);
        };

        bias := bias + learningRate * error * prediction * (1.0 - prediction);
    };

    // Alım-satım sinyali üretme
    public func getSignal() : async Text {
        // Önce ağırlıkların başlatıldığından emin ol
        if (weights.size() == 0) {
            await initializeWeights();
        };
        
        // Veri kontrolü
        if (icpHistory.size() == 0) {
            return "Veri yok. Önce veri yükleyin.";
        };

        let currentData = icpHistory.get(icpHistory.size() - 1);
        
        // Fiyat kontrolü
        if (Float.isNaN(currentData.price) or currentData.price <= 0.0) {
            return "Geçersiz fiyat verisi. Lütfen verileri yeniden yükleyin.";
        };

        let prediction = await predict();
        
        var signal = "";
        var confidence = 0.0;

        if (prediction > 0.7) {
            signal := "AL";
            confidence := prediction * 100;
        } else if (prediction < 0.3) {
            signal := "SAT";
            confidence := (1.0 - prediction) * 100;
        } else {
            signal := "BEKLE";
            confidence := Float.abs(0.5 - prediction) * 200;
        };

        return "Güncel Fiyat: " # Float.toText(currentData.price) # " USDT\n" #
               "Sinyal: " # signal # "\n" #
               "Güven: %" # Float.toText(confidence);
    };

    // Model performansını değerlendirme
    public func getPerformance() : async Float {
        if (icpHistory.size() < 2) return 0.0;

        var correct : Float = 0.0;
        var total : Float = 0.0;

        for (i in Iter.range(1, icpHistory.size() - 1)) {
            let prediction = await predict();
            let currentPrice = icpHistory.get(i).price;
            let previousPrice = icpHistory.get(i-1).price;
            
            let actualUp = currentPrice > previousPrice;
            let predictedUp = prediction > 0.5;
            
            if (actualUp == predictedUp) {
                correct += 1.0;
            };
            total += 1.0;
        };

        return correct / total;
    };

    // Veri çekip modeli eğiten fonksiyon
    public func fetchAndTrain() : async Text {
        try {
            // Veri çek
            let fetchResult = await fetchICPData();
            switch(fetchResult) {
                case (#err(e)) { return "Veri çekme hatası: " # e };
                case (#ok(_)) {
                    // Modeli eğit
                    if (icpHistory.size() >= 2) {
                        await train();
                        let prediction = await predict();
                        let signal = if (prediction > 0.7) {
                            "AL"
                        } else if (prediction < 0.3) {
                            "SAT"
                        } else {
                            "BEKLE"
                        };
                        
                        let currentPrice = icpHistory.get(icpHistory.size() - 1).price;
                        return "Güncel Fiyat: " # Float.toText(currentPrice) # 
                               " USDT\nSinyal: " # signal # 
                               "\nGüven: " # Float.toText(Float.abs(prediction - 0.5) * 200) # "%";
                    } else {
                        return "Yeterli veri yok";
                    };
                };
            };
        } catch (e) {
            return "Hata: " # Error.message(e);
        };
    };

    // Son 24 saatlik verileri çek
    public func fetch24HourData() : async Text {
        try {
            let host = "min-api.cryptocompare.com";
            // Saatlik veri için histohour endpointi
            let url = "https://" # host # "/data/v2/histohour?fsym=ICP&tsym=USDT&limit=24";
            
            let request_headers = [
                { name = "Host"; value = host },
                { name = "User-Agent"; value = "exchange_rate_canister" },
            ];

            let http_request : Types.HttpRequestArgs = {
                url = url;
                headers = request_headers;
                body = null;
                method = #get;
            };

            Cycles.add(20_949_972_000);

            let response = await ic.http_request(http_request);
            let response_body = Blob.fromArray(response.body);
            
            let decoded_text = switch (Text.decodeUtf8(response_body)) {
                case (null) { return "Yanıt decode edilemedi" };
                case (?text) { text };
            };

            // Veri setini temizle
            icpHistory.clear();

            // JSON parse et ve verileri ekle
            let data = parseHistoricalData(decoded_text);
            for (item in data.vals()) {
                icpHistory.add(normalizeData(item));
            };

            return "Son 24 saatlik veri yüklendi. Toplam " # Nat.toText(icpHistory.size()) # " veri noktası.";
        } catch (e) {
            return "Hata: " # Error.message(e);
        };
    };

    // Tarihsel veri parse fonksiyonu
    private func parseHistoricalData(json: Text) : [ICPData] {
        var result : Buffer.Buffer<ICPData> = Buffer.Buffer(24);
        
        if (Text.contains(json, #text "\"Data\":[")) {
            let parts = Text.split(json, #text "\"Data\":[");
            switch(parts.next()) {
                case (?_) {  // İlk parça
                    switch(parts.next()) {
                        case (?dataText) {
                            let items = Text.split(dataText, #text "},{");
                            
                            for (item in items) {
                                if (Text.contains(item, #text "time") and 
                                    Text.contains(item, #text "close") and 
                                    Text.contains(item, #text "volumeto")) {
                                    
                                    let timestamp = parseJsonNumber(item, "time");
                                    let price = parseJsonNumber(item, "close");
                                    let volume = parseJsonNumber(item, "volumeto");
                                    
                                    result.add({
                                        timestamp = Int.abs(Float.toInt(timestamp));
                                        price = price;
                                        volume = volume;
                                        change24h = 0.0;
                                    });
                                };
                            };
                        };
                        case (null) {};
                    };
                };
                case (null) {};
            };
        };
        
        return Buffer.toArray(result);
    };

    // JSON sayı parse fonksiyonu
    private func parseJsonNumber(json: Text, field: Text) : Float {
        let fieldPattern = "\"" # field # "\":";
        if (Text.contains(json, #text fieldPattern)) {
            let parts = Text.split(json, #text fieldPattern);
            switch(parts.next()) {
                case (?_) {  // İlk parça
                    switch(parts.next()) {
                        case (?valueText) {
                            let cleanText = Text.trim(valueText, #text " ,{}\"[]");
                            // Manuel string to float dönüşümü
                            var result : Float = 0.0;
                            var decimalPart : Float = 0.0;
                            var isDecimal : Bool = false;
                            var decimalPlace : Float = 0.1;
                            var isNegative : Bool = false;
                            
                            for (c in cleanText.chars()) {
                                if (c == '-') {
                                    isNegative := true;
                                } else if (c == '.') {
                                    isDecimal := true;
                                } else if (c >= '0' and c <= '9') {
                                    let digit = Float.fromInt(Nat32.toNat(Char.toNat32(c) - 48));
                                    if (isDecimal) {
                                        decimalPart += digit * decimalPlace;
                                        decimalPlace := decimalPlace / 10.0;
                                    } else {
                                        result := result * 10.0 + digit;
                                    };
                                };
                            };
                            let finalResult = result + decimalPart;
                            return if (isNegative) -finalResult else finalResult;
                        };
                        case (null) { return 0.0 };
                    };
                };
                case (null) { return 0.0 };
            };
        };
        return 0.0;
    };

    // Otomatik trading başlat (güncellendi)
    public func startAutoTrading() : async Text {
        if (isRunning) return "Bot zaten çalışıyor!";
        
        // İlk önce 24 saatlik veriyi çek
        let initResult = await fetch24HourData();
        if (Text.contains(initResult, #text "Hata")) {
            return "Bot başlatılamadı: " # initResult;
        };
        
        isRunning := true;
        
        // Her 30 saniyede bir çalışacak şekilde ayarla
        timerId := Timer.setTimer(
            #seconds(30),
            func() : async () {
                let result = await fetchAndTrain();
                Debug.print("\n=== Auto Trading Sonuç ===\n" # result # "\n=====================\n");
            }
        );

        return "Bot başlatıldı. 24 saatlik veri yüklendi ve her 30 saniyede bir güncellenecek.";
    };

    // Periyodik trading durdur
    public func stopAutoTrading() : async Text {
        if (not isRunning) return "Bot zaten durdurulmuş!";
        
        Timer.cancelTimer(timerId);
        isRunning := false;
        return "Bot durduruldu.";
    };

    // Bot durumunu kontrol et
    public func checkBotStatus() : async Text {
        if (isRunning and icpHistory.size() > 0) {
            let lastData = icpHistory.get(icpHistory.size() - 1);
            let timestamp = Int.abs(lastData.timestamp); // Int'i Nat'a çevir
            return "Bot çalışıyor\n" #
                   "Son güncelleme: " # Nat.toText(timestamp) # "\n" #
                   "Son fiyat: " # Float.toText(lastData.price) # " USDT";
        } else {
            return "Bot şu anda çalışmıyor.";
        };
    };

    // Son N işlemi getir
    public func getLastTrades(n : Nat) : async Text {
        if (icpHistory.size() == 0) return "Henüz işlem yok";
        
        let start = Nat.max(0, Nat.sub(icpHistory.size(), n));
        var result = "Son " # Nat.toText(n) # " işlem:\n";
        
        for (i in Iter.range(start, icpHistory.size() - 1)) {
            let data = icpHistory.get(i);
            let timestamp = Int.abs(data.timestamp); // Int'i Nat'a çevir
            result #= "Zaman: " # Nat.toText(timestamp) # 
                      " Fiyat: " # Float.toText(data.price) # " USDT\n";
        };
        
        return result;
    };
}