import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Trie "mo:base/Trie";
import Option "mo:base/Option";

actor User {
    public query (message) func greet() : async Principal {
        message.caller;
    };

    public type Result<T, E> = Result.Result<T, E>;

    public type UserType = {
        name : Text;
        avatar : Text;
    };

    private stable var users : Trie.Trie<Principal, UserType> = Trie.empty();

    public shared func signUpWithInternetIdentity(name : Text, avatar : ?Text, principalId : Principal) : async Bool {
        let result = Trie.find(users, userKey(principalId), Principal.equal);
        let exists = Option.isSome(result);

        if (exists) {
            return false;
        };

        let userAvatar = switch (avatar) {
            case (?a) { a };
            case null {
                "https://cryptologos.cc/logos/internet-computer-icp-logo.png";
            };
        };

        let newUser = { name = name; avatar = userAvatar };
        users := Trie.replace(users, userKey(principalId), Principal.equal, ?newUser).0;

        return true;
    };

    public func getUserInfo(principalId : Text) : async ?UserType {
        let principal : ?Principal = do {
            try {
                ?Principal.fromText(principalId);
            } catch _ {
                null;
            };
        };

        switch (principal) {
            case (?p) {
                let result = Trie.find(users, userKey(p), Principal.equal);
                return result;
            };
            case null {
                return null;
            };
        };
    };

    public shared func updateUser(user : UserType, caller : Principal) : async Bool {
        let result = Trie.find(users, userKey(caller), Principal.equal);
        let exists = Option.isSome(result);
        if (exists) {
            users := Trie.replace(users, userKey(caller), Principal.equal, ?user).0;
        };
        return exists;
    };

    // Delete a User
    public shared func deleteUser(caller : Principal) : async Bool {
        let result = Trie.find(users, userKey(caller), Principal.equal);
        let exists = Option.isSome(result);
        if (exists) {
            users := Trie.replace(users, userKey(caller), Principal.equal, null).0;
        };
        return exists;
    };

    // Get the current user based on the caller's principal
    public query func getCurrentUser(caller : Principal) : async ?UserType {
        let result = Trie.find(users, userKey(caller), Principal.equal);
        return result;
    };

    // Get All Users
    public query func listUsers() : async [(Principal, UserType)] {
        return Trie.toArray<Principal, UserType, (Principal, UserType)>(
            users,
            func(k, v) : (Principal, UserType) { (k, v) },
        );
    };

    private func userKey(x : Principal) : Trie.Key<Principal> {
        return { hash = Principal.hash x; key = x };
    };
};
