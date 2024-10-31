﻿namespace Project.Dto
{
    public class ChartDto
    {
    }


    public class CleaningReportDetailDto
    {
        public string Status { get; set; }
        public int Count { get; set; }
    }

    public class CleaningReportSummaryDto
    {
        public int TotalReportsToday { get; set; }
        public List<CleaningReportDetailDto> ReportCounts { get; set; }
    }

    public class CampusReportComparisonDto
    {
        public string CampusName { get; set; }
        public double AverageValue { get; set; }
        public int CountNotMet { get; set; }
        public int CountCompleted { get; set; }
        public int CountWellCompleted { get; set; }
    }

    public class ResponsibleTagReportDto
    {
        public string TagName { get; set; }
        public string LastName { get; set; }
        public string FristName { get; set; }
        public int TotalReport { get; set; }
        public int? Progress { get; set; }
        public string Status { get; set; }
    }
}
