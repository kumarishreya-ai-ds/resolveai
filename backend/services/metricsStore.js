class MetricsStore {
  constructor() {
    this.requestsProcessed = 0;
    this.totalProcessingTime = 0;
    this.escalations = 0;
    this.successfulResolutions = 0;
  }

  recordRequest(durationMs, escalation = false, resolved = false) {
    this.requestsProcessed += 1;
    this.totalProcessingTime += durationMs;
    if (escalation) {
      this.escalations += 1;
    }
    if (resolved) {
      this.successfulResolutions += 1;
    }
  }

  getSnapshot() {
    return {
      requestsProcessed: this.requestsProcessed,
      averageProcessingTime: this.requestsProcessed > 0 ? Math.round(this.totalProcessingTime / this.requestsProcessed) : 0,
      escalations: this.escalations,
      successfulResolutions: this.successfulResolutions,
    };
  }
}

export default new MetricsStore();
