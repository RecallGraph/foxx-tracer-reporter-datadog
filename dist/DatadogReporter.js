'use strict'
const foxx_tracer_1 = require('@recallgraph/foxx-tracer')
const opentracing_1 = require('opentracing')
const request = require('@arangodb/request')
module.exports = class DatadogReporter extends foxx_tracer_1.reporters.Reporter {
  constructor (namespace = 'datadog') {
    super(namespace)
  }

  report (traces) {
    const ddTraces = traces.map(trace => trace.map(span => {
      const record = {
        duration: Math.floor((span.finishTimeMs - span.startTimeMs) * 1e6),
        name: span.operation,
        resource: span.tags[opentracing_1.Tags.COMPONENT],
        service: span.tags.service || 'UNKNOWN',
        span_id: parseInt(span.context.span_id, 16),
        start: Math.floor(span.startTimeMs * 1e6),
        trace_id: parseInt(span.context.trace_id, 16),
        type: span.tags[opentracing_1.Tags.SPAN_KIND] || 'db'
      }
      const parent = span.references.find(ref => ref.type === opentracing_1.REFERENCE_CHILD_OF)
      if (parent) {
        record.parent_id = parseInt(parent.context.span_id, 16)
      }
      const hasError = span.tags[opentracing_1.Tags.ERROR]
      if (hasError) {
        record.error = 1
      }
      record.meta = {}
      for (const key in span.tags) {
        if (span.tags.hasOwnProperty(key)) {
          record.meta[key] = JSON.stringify(span.tags[key])
        }
      }
      record.metrics = {}
      const logs = Object.assign({}, ...span.logs.map(log => log.fields))
      for (const key in logs) {
        if (logs.hasOwnProperty(key)) {
          const val = parseFloat(logs[key])
          if (Number.isFinite(val)) {
            record.metrics[key] = val
          }
        }
      }
      return record
    }))
    request.put(this.config['dd-agent-url'], {
      json: true,
      body: ddTraces,
      headers: {
        'X-Datadog-Trace-Count': `${ddTraces.length}`
      }
    })
  }
}
//# sourceMappingURL=DatadogReporter.js.map