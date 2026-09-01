export type GenerateReportRequest = {
  activity: string;
  learning?: string;
  obstacle?: string;
};

export type ReportData = {
  activity: string;
  learning: string;
  obstacle: string;
};

export type GenerateReportResponse =
  | {
      success: true;
      data: ReportData;
      meta: {
        activityChars: number;
        learningChars: number;
        obstacleChars: number;
      };
    }
  | { success: false; error: { code: string; message: string } };

export type ReportFieldKey = "activity" | "learning" | "obstacle";