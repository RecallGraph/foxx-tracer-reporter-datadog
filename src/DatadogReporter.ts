import { reporters, SpanData } from '@recallgraph/foxx-tracer';
import { REFERENCE_CHILD_OF, Tags } from 'opentracing';
import request = require('@arangodb/request');

type Record = {
  trace_id: number;
  span_id: number;
  name: string;
  resource: string;
  service: string;
  type: string;
  start: number;
  duration: number;
  parent_id?: number;
  error?: number;
  meta?: { [key: string]: string };
  metrics?: { [key: string]: number };
}

export = class DatadogReporter extends reporters.Reporter {
  constructor(namespace: string = 'datadog') {
    super(namespace);
  }

  report(traces: SpanData[][]): void {
    const ddTraces = traces.map(trace => trace.map(span => {
      const record: Record = {
        duration: Math.floor((span.finishTimeMs - span.startTimeMs) * 1e6),
        name: span.operation,
        resource: <string>span.tags[Tags.COMPONENT],
        service: <string>span.tags.service || 'UNKNOWN',
        span_id: parseInt(span.context.span_id, 16),
        start: Math.floor(span.startTimeMs * 1e6),
        trace_id: parseInt(span.context.trace_id, 16),
        type: <string>span.tags[Tags.SPAN_KIND] || 'db'
      };

      const parent = span.references.find(ref => ref.type === REFERENCE_CHILD_OF);
      if (parent) {
        record.parent_id = parseInt(parent.context.span_id, 16);
      }

      const hasError = span.tags[Tags.ERROR];
      if (hasError) {
        record.error = 1;
      }

      record.meta = {};
      for (const key in span.tags) {
        if (span.tags.hasOwnProperty(key)) {
          record.meta[key] = JSON.stringify(span.tags[key]);
        }
      }

      record.metrics = {};
      const logs = Object.assign({}, ...span.logs.map(log => log.fields));

      for (const key in logs) {
        if (logs.hasOwnProperty(key)) {
          const val = parseFloat(logs[key]);
          if (Number.isFinite(val)) {
            record.metrics[key] = val;
          }
        }
      }

      return record;
    }));

    request.put(this.config['dd-agent-url'], {
      json: true,
      body: ddTraces,
      headers: {
        'X-Datadog-Trace-Count': `${ddTraces.length}`
      }
    });
  }
}