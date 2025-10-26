import React, { useState, useEffect } from 'react';
import { apiService, UserStats, GameScore } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Stats = () => {
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [gameScores, setGameScores] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setLoading(true);
        // Assuming currentUser.uid is a number or can be converted to one
        const userId = parseInt(currentUser.uid) || 1; // fallback to 1 for now
        
        const [stats, scores] = await Promise.all([
          apiService.getUserStats(userId),
          apiService.getUserGameScores(userId)
        ]);
        
        setUserStats(stats);
        setGameScores(scores);
      } catch (err) {
        setError('Failed to load user statistics');
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="stats-container">
        <h1>Your Statistics</h1>
        <div className="loading">Loading your statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-container">
        <h1>Your Statistics</h1>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="stats-container">
        <h1>Your Statistics</h1>
        <div className="no-data">No statistics available yet. Play some games to see your stats!</div>
      </div>
    );
  }

  // Calculate additional stats
  const recentScores = gameScores.slice(-10); // Last 10 games
  const scoreImprovement = recentScores.length >= 2 
    ? recentScores[recentScores.length - 1].score - recentScores[0].score
    : 0;

  return (
    <div className="stats-container">
      <h1>Your Statistics</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Best Score</h3>
          <div className="stat-value">{userStats.best_score}</div>
        </div>
        
        <div className="stat-card">
          <h3>Average Score</h3>
          <div className="stat-value">{userStats.average_score.toFixed(1)}</div>
        </div>
        
        <div className="stat-card">
          <h3>Median Score</h3>
          <div className="stat-value">{userStats.median_score}</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Games</h3>
          <div className="stat-value">{userStats.total_games}</div>
        </div>
      </div>

      <div className="stats-section">
        <h2>Score Trend</h2>
        <div className="trend-chart">
          {userStats.score_trend.length > 0 ? (
            <div className="trend-bars">
              {userStats.score_trend.map((score, index) => (
                <div key={index} className="trend-bar">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(score / userStats.best_score) * 100}%`,
                      backgroundColor: score === userStats.best_score ? '#4CAF50' : '#2196F3'
                    }}
                  ></div>
                  <span className="bar-label">{score}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-trend-data">Play more games to see your score trend!</div>
          )}
        </div>
      </div>

      <div className="stats-section">
        <h2>Recent Games</h2>
        <div className="recent-games">
          {recentScores.length > 0 ? (
            <div className="games-list">
              {recentScores.slice().reverse().map((game, index) => (
                <div key={game.id || index} className="game-item">
                  <div className="game-score">{game.score}</div>
                  <div className="game-details">
                    <div className="game-date">
                      {game.created_at ? new Date(game.created_at).toLocaleDateString() : 'Recent'}
                    </div>
                    {game.difficulty && (
                      <div className="game-difficulty">{game.difficulty}</div>
                    )}
                    {game.game_duration && (
                      <div className="game-duration">{game.game_duration}s</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-games">No recent games found</div>
          )}
        </div>
      </div>

      {scoreImprovement !== 0 && (
        <div className="improvement-notice">
          <h3>Recent Performance</h3>
          <p>
            {scoreImprovement > 0 ? '📈' : '📉'} 
            Your score has {scoreImprovement > 0 ? 'improved' : 'decreased'} by {Math.abs(scoreImprovement)} points 
            in your last 10 games.
          </p>
        </div>
      )}
    </div>
  );
};

export default Stats;