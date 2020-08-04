import { reporters, SpanData } from 'foxx-tracer';

export default class DatadogReporter implements reporters.Reporter {
  private readonly ddURL;

  constructor(ddURL: string);

  report(traces: SpanData[][]): void;
}
//# sourceMappingURL=DatadogReporter.d.ts.map