import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import NavBar from './components/NavBar';
import StarryBackground from './components/StarryBackground';
import OrbContextProvider from './components/OrbContextProvider';
import { AuthProvider } from './contexts/AuthContext';

/**
 * AdminAnalyticsPage fetches metrics from the Google Analytics Data API and
 * displays them in a simple table. The access token and property ID should be
 * provided via environment variables REACT_APP_GA_ACCESS_TOKEN and
 * REACT_APP_GA_PROPERTY_ID.
 */
export default function AdminAnalyticsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const token = process.env.REACT_APP_GA_ACCESS_TOKEN;
      const propertyId = process.env.REACT_APP_GA_PROPERTY_ID;
      if (!token || !propertyId) return;

      try {
        const res = await fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
              metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
              dimensions: [{ name: 'date' }],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          setReport(data);
        } else {
          console.error('Failed to fetch analytics', await res.text());
        }
      } catch (err) {
        console.error('Error contacting Google Analytics', err);
      }
    };

    fetchReport();
  }, []);

  const renderTable = () => {
    if (!report) {
      return <Typography>Loading analytics…</Typography>;
    }

    const { dimensionHeaders = [], metricHeaders = [], rows = [] } = report;

    return (
      <Paper sx={{ mt: 2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {dimensionHeaders.map((h) => (
                <TableCell key={h.name}>{h.name}</TableCell>
              ))}
              {metricHeaders.map((h) => (
                <TableCell key={h.name}>{h.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                {row.dimensionValues.map((d, j) => (
                  <TableCell key={`d-${j}`}>{d.value}</TableCell>
                ))}
                {row.metricValues.map((m, j) => (
                  <TableCell key={`m-${j}`}>{m.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  };

  return (
    <OrbContextProvider>
      <AuthProvider>
        <StarryBackground />
        <NavBar />
        <Box sx={{ p: 2, color: '#fff' }}>
          <Typography variant="h4" gutterBottom>
            Analytics Dashboard
          </Typography>
          {renderTable()}
        </Box>
      </AuthProvider>
    </OrbContextProvider>
  );
}
