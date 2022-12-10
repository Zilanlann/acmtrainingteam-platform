import * as echarts from "echarts";
import moment from "moment";

// Career

function showAcSubmissionsTypeChart(status) {
  const chartDom = document.getElementById("acSubmissionsType");
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: `${status.submission_number} AC submissions`,
      left: "center",
    },
    xAxis: {
      type: "category",
      data: ["Easy", "Medium", "Hard", "Vary Hard", "Hardcore"],
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
    },
    series: [
      {
        data: [
          {
            value: status["easy_ac_submission_number"],
            name: "Easy",
            itemStyle: {
              color: "#f3a683",
            },
          },
          {
            value: status["medium_ac_submission_number"],
            name: "Medium",
            itemStyle: {
              color: "#778beb",
            },
          },
          {
            value: status["hard_ac_submission_number"],
            name: "Hard",
            itemStyle: {
              color: "#cf6a87",
            },
          },
          {
            value: status["veryhard_ac_submission_number"],
            name: "Vary Hard",
            itemStyle: {
              color: "#3dc1d3",
            },
          },
          {
            value: status["hardcore_ac_submission_number"],
            name: "Hardcore",
            itemStyle: {
              color: "#574b90",
            },
          },
        ],
        type: "bar",
      },
    ],
  };
  myChart.setOption(option);
}

function showTotalSubmissionsChart(status) {
  const chartDom = document.getElementById("totalSubmissions");
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: `AC rate: ${parseInt(
        (100 * status.ac_submission_number) / status.submission_number
      )}%`,
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: "50%",
        label: {
          show: false,
        },
        data: [
          {
            value: status.ac_submission_number,
            name: "Accepted",
            itemStyle: {
              color: "#67C23A",
            },
          },
          {
            value: status.submission_number - status.ac_submission_number,
            name: "Others",
            itemStyle: {
              color: "#F56C6C",
            },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  myChart.setOption(option);
}

function showCareerCharts(submissionStatus) {
  showAcSubmissionsTypeChart(submissionStatus);
  showTotalSubmissionsChart(submissionStatus);
}

function transformCalendarData(calendarSubmissions) {
  const calendarMap = {};
  calendarSubmissions.forEach((submitTime) => {
    const submitDate = moment.unix(submitTime).format("YYYY-MM-DD");
    calendarMap[submitDate] = calendarMap[submitDate]
      ? calendarMap[submitDate] + 1
      : 1;
  });
  const calendarArray = [];
  for (const submitDate in calendarMap) {
    calendarArray.push([submitDate, calendarMap[submitDate]]);
  }
  return calendarArray;
}

function showCalendarChart(calendarSubmissions) {
  const data = transformCalendarData(calendarSubmissions);
  const chartDom = document.getElementById("calendar");
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      left: "center",
      text: `${calendarSubmissions.length} AC submissions in the past 6 months`,
    },
    tooltip: {
      position: "top",
      formatter: function (p) {
        const format = echarts.time.format(
          p.data[0],
          "{yyyy}-{MM}-{dd}",
          false
        );
        return format + ": " + p.data[1];
      },
    },
    legend: {
      show: false,
    },
    visualMap: {
      pieces: [
        { value: 1, color: "#B39DDB" },
        { value: 2, color: "#9575CD" },
        { value: 3, color: "#7E57C2" },
        { value: 4, color: "#673AB7" },
        { value: 5, color: "#5E35B1" },
        { value: 6, color: "#512DA8" },
        { value: 7, color: "#4527A0" },
        { min: 7, color: "#311B92" },
      ],
      type: "piecewise",
      orient: "horizontal",
      left: "center",
      top: 9999,
    },
    calendar: {
      top: 60,
      left: 50,
      right: 50,
      cellSize: ["auto", 13],
      range: [
        moment().subtract(182, "days").format("YYYY-MM-DD"),
        moment().subtract(1, "days").format("YYYY-MM-DD"),
      ],
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: { show: false },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: data,
    },
  };
  myChart.setOption(option);
}

function showRecentUserStatusChart(submissionStatus, allUserSubmissionStatus) {
  const maxData = [
    parseInt(allUserSubmissionStatus.max_active_score),
    allUserSubmissionStatus.max_week_ac_submission_number,
    parseInt(allUserSubmissionStatus.max_week_average_ac_rating),
    allUserSubmissionStatus.max_month_ac_submission_number,
    parseInt(allUserSubmissionStatus.max_month_average_ac_rating),
  ];
  const averageData = [
    parseInt(allUserSubmissionStatus.average_active_score),
    allUserSubmissionStatus.average_week_ac_submission_number.toFixed(2),
    parseInt(allUserSubmissionStatus.average_week_average_ac_rating),
    allUserSubmissionStatus.average_month_ac_submission_number.toFixed(2),
    parseInt(allUserSubmissionStatus.average_month_average_ac_rating),
  ];
  const chartDom = document.getElementById("recentUserStatus");
  const myChart = echarts.init(chartDom);
  const option = {
    legend: {
      data: ["Max", "Average", "User"],
      orient: "vertical",
      left: "left",
    },
    tooltip: {
      trigger: "item",
    },
    radar: {
      shape: "circle",
      indicator: [
        { name: "Active Score", max: maxData[0], color: "#464646" },
        { name: "Week AC", max: maxData[1], color: "#464646" },
        { name: "Week avg rating", max: maxData[2], color: "#464646" },
        { name: "Month AC", max: maxData[3], color: "#464646" },
        { name: "Month avg rating", max: maxData[4], color: "#464646" },
      ],
    },
    series: [
      {
        type: "radar",
        data: [
          {
            value: maxData,
            name: "Max",
          },
          {
            value: averageData,
            name: "Average",
          },
          {
            value: [
              parseInt(submissionStatus.active_score),
              submissionStatus.week_ac_submission_number,
              parseInt(submissionStatus.week_average_ac_rating),
              submissionStatus.month_ac_submission_number,
              parseInt(submissionStatus.month_average_ac_rating),
            ],
            name: "User",
            label: {
              show: true,
              formatter: function (params) {
                return params.value;
              },
            },
          },
        ],
      },
    ],
  };

  myChart.setOption(option);
}

function showActivityCharts(information) {
  showCalendarChart(information.calendarSubmissions);
  showRecentUserStatusChart(
    information.submissionStatus,
    information.allUserSubmissionStatus
  );
}

export { showCareerCharts, showActivityCharts };
