import React, { useState, useEffect } from 'react';
import { apiService, UserStats, OverallStats as OverallStatType } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const OverallStats = () => {
  const { currentUser } = useAuth();
  const [overallStats, setOverallStats] = useState<OverallStatType | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [overall, user] = await Promise.all([
          apiService.getOverallStats(),
          currentUser?.uid ? apiService.getUserStats(parseInt(currentUser.uid) || 1) : null
        ]);
        
        setOverallStats(overall);
        setUserStats(user);
      } catch (err) {
        setError('Failed to load overall statistics');
        console.error('Error fetching overall stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="overall-stats-container">
        <h1>Global Statistics</h1>
        <div className="loading">Loading global statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overall-stats-container">
        <h1>Global Statistics</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!overallStats) {
    return (
      <div className="overall-stats-container">
        <h1>Global Statistics</h1>
        <div className="no-data">No global statistics available yet.</div>
      </div>
    );
  }

  // Calculate user's percentile ranking
  const getUserPercentile = () => {
    if (!userStats || !overallStats) return null;
    
    // This would need to be calculated on the backend with actual data
    // For now, we'll show a mock calculation
    const userScore = userStats.average_score;
    const globalAvg = overallStats.global_average_score;
    
    if (userScore > globalAvg) {
      return Math.min(95, 50 + ((userScore - globalAvg) / globalAvg) * 50);
    } else {
      return Math.max(5, 50 - ((globalAvg - userScore) / globalAvg) * 50);
    }
  };

  const userPercentile = getUserPercentile();

  return (
    <div className="overall-stats-container">
      <h1>Global Statistics</h1>
      
      <div className="global-stats-grid">
        <div className="stat-card global">
          <h3>Global Best Score</h3>
          <div className="stat-value">{overallStats.global_best_score}</div>
        </div>
        
        <div className="stat-card global">
          <h3>Global Average</h3>
          <div className="stat-value">{overallStats.global_average_score.toFixed(1)}</div>
        </div>
        
        <div className="stat-card global">
          <h3>Global Median</h3>
          <div className="stat-value">{overallStats.global_median_score}</div>
        </div>
        
        <div className="stat-card global">
          <h3>Total Players</h3>
          <div className="stat-value">{overallStats.total_users}</div>
        </div>
      </div>

      {userStats && (
        <div className="comparison-section">
          <h2>Your Performance vs Global</h2>
          <div className="comparison-grid">
            <div className="comparison-item">
              <h4>Your Best Score</h4>
              <div className="comparison-value">
                {userStats.best_score}
                <span className="vs-global">
                  vs Global: {overallStats.global_best_score}
                </span>
              </div>
              <div className="comparison-bar">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: `${(userStats.best_score / overallStats.global_best_score) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="comparison-item">
              <h4>Your Average Score</h4>
              <div className="comparison-value">
                {userStats.average_score.toFixed(1)}
                <span className="vs-global">
                  vs Global: {overallStats.global_average_score.toFixed(1)}
                </span>
              </div>
              <div className="comparison-bar">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: `${(userStats.average_score / overallStats.global_average_score) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {userPercentile && (
            <div className="percentile-info">
              <h3>Your Ranking</h3>
              <div className="percentile-display">
                You are in the top <strong>{Math.round(100 - userPercentile)}%</strong> of players!
                <div className="percentile-bar">
                  <div 
                    className="percentile-fill" 
                    style={{ width: `${userPercentile}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="stats-section">
        <h2>Score Distribution</h2>
        <div className="distribution-chart">
          {overallStats.score_distribution.length > 0 ? (
            <div className="distribution-bars">
              {overallStats.score_distribution.map((item, index) => (
                <div key={index} className="distribution-item">
                  <div className="range-label">{item.score_range}</div>
                  <div className="distribution-bar">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        height: `${(item.count / Math.max(...overallStats.score_distribution.map(d => d.count))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="count-label">{item.count}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-distribution">No distribution data available</div>
          )}
        </div>
      </div>

      <div className="stats-section">
        <h2>Recent Activity</h2>
        <div className="activity-chart">
          {overallStats.recent_activity.length > 0 ? (
            <div className="activity-bars">
              {overallStats.recent_activity.slice(-7).map((item, index) => (
                <div key={index} className="activity-item">
                  <div className="date-label">
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="activity-bar">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        height: `${(item.games_played / Math.max(...overallStats.recent_activity.map(a => a.games_played))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="games-label">{item.games_played}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity">No recent activity data</div>
          )}
        </div>
      </div>

      <div className="monkey-comparison">
        <h2>🐒 Monkey Intelligence Comparison</h2>
        <div className="monkey-info">
          <p>
            According to research, monkeys can typically remember sequences of 4-7 items.
            The average human can remember 7±2 items (Miller's Rule).
          </p>
          <div className="monkey-stats">
            <div className="monkey-stat">
              <span className="label">Monkey Average:</span>
              <span className="value">5-6 items</span>
            </div>
            <div className="monkey-stat">
              <span className="label">Human Average:</span>
              <span className="value">7±2 items</span>
            </div>
            <div className="monkey-stat">
              <span className="label">Your Average:</span>
              <span className="value">{userStats?.average_score.toFixed(1) || 'N/A'} items</span>
            </div>
          </div>
          {userStats && (
            <div className="monkey-comparison-result">
              {userStats.average_score > 7 ? (
                <p className="above-human">🧠 You're performing above average human capacity!</p>
              ) : userStats.average_score > 5 ? (
                <p className="human-level">👤 You're performing at human level!</p>
              ) : (
                <p className="monkey-level">🐒 You're performing at monkey level - keep practicing!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverallStats;