import React, { useState } from 'react';
import { Container, Button, Typography, Box, CircularProgress, Divider, Card, CardContent, Grid, Paper } from '@mui/material';
import { icpai_backend } from '../../../declarations/icpai_backend';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { CheckCircle, Error, HelpOutline } from '@mui/icons-material';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [signal, setSignal] = useState('');
    const [signalDetails, setSignalDetails] = useState('');
    const [trades, setTrades] = useState([]);

    const fetchSignal = async () => {
        setLoading(true);
        const response = await icpai_backend.getSignal();
        setSignalDetails(parseSignal(response));
        setLoading(false);
    };

    const fetchLastTrades = async () => {
        setLoading(true);
        const result = await icpai_backend.getLastTrades(5);
        console.log(result);

        const tradeData = parseTrades(result);
        setTrades(tradeData);
        setLoading(false);
    };

    const parseSignal = (signalString) => {
        const parts = signalString.split('\n');
        const price = parts[0].split(':')[1].trim(); 
        const signal = parts[1].split(':')[1].trim(); 
        const confidence = parts[2].split(':')[1].trim();

        return { price, signal, confidence };
    };

    const parseTrades = (tradeString) => {
        const tradeList = tradeString.split("Zaman:").slice(1); 
        const parsedTrades = tradeList.map(trade => {
            const parts = trade.split("Fiyat:");
            const time = parts[0].trim();
            const price = parseFloat(parts[1].trim());
            return { time, price };
        });
        return parsedTrades;
    };

    const tradeChartData = {
        labels: trades.map((trade, index) => `Trade ${index + 1}`),
        datasets: [
            {
                label: 'Price (USDT)',
                data: trades.map((trade) => trade.price),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    return (
        <Container maxWidth="lg" sx={{mt:8}}>
            <Typography variant="h3" color="primary" gutterBottom>
                SmartParite
            </Typography>

            {/* Signal Section */}
            <Box mb={5}>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                    Signal & Trading Overview
                </Typography>

                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={fetchSignal} 
                    disabled={loading}
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Get Signal'}
                </Button>

                {signalDetails && (
                    <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Signal Details</Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>Current Price:</Typography>
                            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'green' }}>
                                {signalDetails.price} USDT
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>Signal:</Typography>
                            <Typography 
                                variant="body1" 
                                sx={{
                                    fontSize: '1.1rem', 
                                    color: signalDetails.signal === 'AL' ? 'green' : 'red', 
                                    display: 'flex', 
                                    alignItems: 'center'
                                }}
                            >
                                {signalDetails.signal === 'AL' ? <CheckCircle sx={{ mr: 1 }} /> : <Error sx={{ mr: 1 }} />}
                                {signalDetails.signal}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center">
                            <Typography variant="body1" sx={{ fontWeight: 'bold', width: '150px' }}>Confidence:</Typography>
                            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                                {signalDetails.confidence} %
                            </Typography>
                        </Box>
                    </Card>
                )}
            </Box>

            {/* Last Trades Section */}
            <Divider sx={{ mb: 3 }} />
            <Box mb={5}>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                    Latest Trades & Chart
                </Typography>

                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={fetchLastTrades} 
                    disabled={loading}
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'View Last Trades'}
                </Button>

                {trades.length > 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Last Trades</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <ul>
                                        {trades.map((trade, index) => (
                                            <li key={index}>
                                                <Typography variant="body2">
                                                    {new Date(parseInt(trade.time)).toLocaleString()} - {trade.price} USDT
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Price Chart (Last Trades)</Typography>
                                    <Line data={tradeChartData} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Box>

            {/* Auto Trading Section */}
            <Divider sx={{ mb: 3 }} />
            <Box mb={5}>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                    Auto Trading
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <HelpOutline sx={{ mr: 1 }} />
                    Feature coming soon!
                </Typography>
            </Box>
        </Container>
    );
};

export default Home;
