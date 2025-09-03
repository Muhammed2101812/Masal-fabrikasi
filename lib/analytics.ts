// lib/analytics.ts
// Privacy-first analytics solution

type EventType = 'page_view' | 'story_generated' | 'tts_played' | 'story_copied';

interface AnalyticsEvent {
  type: EventType;
  timestamp: number;
  metadata?: Record<string, string | number | boolean>;
}

class PrivacyFirstAnalytics {
  private events: AnalyticsEvent[] = [];
  private maxEvents = 100;

  // Track an event
  track(type: EventType, metadata?: Record<string, string | number | boolean>) {
    // In a real implementation, you would send this to your analytics server
    // For privacy-first approach, we only collect anonymous, non-personal data
    
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      metadata
    };

    // Add to local buffer
    this.events.push(event);
    
    // Keep only the last N events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics event:', event);
    }

    // In a real implementation, you would send this to your analytics server
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // }).catch(err => console.error('Analytics error:', err));
  }

  // Get all events (for debugging)
  getEvents() {
    return [...this.events];
  }

  // Clear events
  clear() {
    this.events = [];
  }
}

// Singleton instance
export const analytics = new PrivacyFirstAnalytics();