total = 'https://covid-19-greece.herokuapp.com/all'
recovered = 'https://covid-19-greece.herokuapp.com/recovered'

function int_from_date(date) {
  return date.split('-').join('')
}

class covid {
	constructor() {
  	this.start_int = int_from_date('2020-02-26')
    this.ready = false
  }

  ignore_early_dates(arr = this.data) {
    for (var i = 0; i < arr.length; i++) {
      if (this.start_int === int_from_date(arr[i].date)) {
      	return arr.splice(i,arr.length);
      }
    }
  }

  per_day_data(arr, arr2 = []) {
    for (var i = 0; i < arr.length +1; i++) {
      if (i === arr.length ) {
      	return arr2
      } else if (i === 0) {
        arr2[i] = []
        Object.keys(arr[i]).forEach(function(z) {
          arr2[i][z] = arr[i][z];
        })
      } else {
        arr2[i] = this.day_data(arr[i], arr[i-1])
      }
    }
  }

  split_data(arr, arg1, arr2 = []) {
    if (arg1 == "confirmed") {
      for (var i = 1; i < arr.length +1; i++) {
        arr2.push({x: new Date(arr[i-1].date), y: arr[i-1].confirmed});
      }
    } else if (arg1 === "intensive_care") {
      for (var i = 1; i < arr.length +1; i++) {
        arr2.push({x: new Date(arr[i-1].date), y: arr[i-1].intensive_care});
      }
    } else if (arg1 === "deaths") {
      for (var i = 1; i < arr.length +1; i++) {
        arr2.push({x: new Date(arr[i-1].date), y: arr[i-1].deaths});
      }
    } else if (arg1 ==="region_en_name") {
      for (var i = 1; i < arr.length +1; i++) {
        arr2.push({y: arr[i-1].region_cases, label:arr[i-1].region_en_name});
      }
    }
    return arr2;
  }

  age_gender_dist(arr,arg1=[]){
    var key = ["0-17","18-39","40-64","65+"]
    for (var i = 0; i < key.length +1; i++) {
    arg1.push({y: arr[key[i]], label: key[i]})
  }
    return arg1;
  }

  day_data(arr, prev_arr, arr2 =[]) {
    var actualthis = this
    Object.keys(arr).forEach(function(z) {
      if (typeof arr[z] === "string") {
        arr2[z] = arr[z];
      } else if (typeof arr[z] === "number" || arr[z] === null) {
        arr2[z] = arr[z] - prev_arr[z];
      } else {
        arr2[z] = actualthis.day_data(arr[z], prev_arr[z])
      }
    });
    return arr2;
  }

  fetchWrap(data,call,rando = Math.random().toString(36).substr(2, 5)) {
    this[rando] = eval(call)
    this[rando](data)
    delete(this[rando])
  }

  fetch(url, call) {
    this.asd = true
    var actualthis = this
  	$.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      cache: false,
      success: function(data) {
        actualthis.fetchWrap(data,call.toString())
      }
    });
  }

  draw_chart(arr) {
  }
  render() {
    this.canvas.render()
  }
  doughnutSexChart(id,dataPoints) {
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      title: {
        text: "",
      },
      data: [{
		type: "doughnut",
    indexLabelFontSize: 10,
    indexLabelFontColor: "#fff",
		startAngle: 240,
		yValueFormatString: "##0.00\"%\"",
		indexLabel: "{label} {y}",
		dataPoints: dataPoints
	}]
    });
  }
  doughnutChart(id,percentage) {
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      title: {
        fontColor: "#848484",
        fontSize: 70,
        horizontalAlign: "center",
        text: percentage + "%",
        verticalAlign: "center"
      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242"
      },
      data: [
        {
          explodeOnClick: false,
          innerRadius: "96%",
          radius: "90%",
          startAngle: 270,
          type: "doughnut",
          dataPoints: [
            { y: percentage, color: "#c70000", toolTipContent: null },
            { y: 100 - percentage, color: "#424242", toolTipContent: null }
          ]
        }
      ]
    });
  }
  ColumnChart(id,dataPoints) {
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        labelFontColor: "#f7f6f6",
        labelFontSize: 12,
        labelAngle: 0,
        lineThickness: 0,
        tickThickness: 0
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickThickness: 0,
        valueFormatString: " "

      },

      data: [
        {
          color: "#424242",
          type: "column",
          dataPoints: dataPoints
        }
      ]
    });
  }

  splineArea(id,dataPoints) {

    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        lineThickness: 0,
        minimum: dataPoints[0].x,
        maximum: dataPoints[dataPoints.length-1].x,
        tickLength: 0,
        valueFormatString: " "
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickLength: 0,
        valueFormatString: " "
      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242"
      },
      data: [
        {
          color: "#424242",
          fillOpacity: 1,
          lineColor: "#ffffff",
          lineThickness: 3,
          markerSize: 0,
          type: "splineArea",
          dataPoints: dataPoints
        }
      ]
    });
  }

  totalGraph(id,dataPoints) {
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        gridThickness: 0,
        labelFontColor: "#bbbbbb",
        lineColor: "#bbbbbb"
      },
      axisY: {
        gridThickness: 0,
        labelFontColor: "#bbbbbb",
        logarithmic: true,
        title: "Number of people (Log)",
        lineColor: "#bbbbbb"
      },
      legend: {
        dockInsidePlotArea: true,
        fontColor: "#ffffff",
        fontSize: 16,
        horizontalAlign: "right",
        verticalAlign: "top"
      },
      toolTip: {
        backgroundColor: "#000000",
        borderThickness: 2,
        cornerRadius: 0,
        fontColor: "#ffffff",
        shared: true
      },
      data: [
        {
          color: "#424242",
          legendMarkerType: "square",
          legendText: "Tests Conducted",
          name: "Tests Conducted",
          showInLegend: true,
          type: "line",
          dataPoints: dataPoints[0]
        },
        {
          color: "#424242",
          legendMarkerType: "square",
          legendText: "Deaths",
          name: "Deaths",
          showInLegend: true,
          type: "line",
          dataPoints: dataPoints[1]
        },
        {
          color: "#c70000",
          legendMarkerType: "square",
          legendText: "Total Infections",
          name: "Total Infections",
          showInLegend: true,
          type: "line",
          dataPoints: dataPoints[2]
        }
      ]
    });
  }

  stateChart(id,dataPoints) {
    return new CanvasJS.Chart(id, {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        labelFontColor: "#f7f6f6",
        labelFontSize: 12,
        labelAngle: 0,
        lineThickness: 0,
        tickThickness: 0
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickThickness: 0,
        valueFormatString: " "

      },

      data: [
        {
          color: "#424242",
          type: "column",
          dataPoints: dataPoints
        }
      ]
    });
  }

  ageChart(id,dataPoints) {
    return CanvasJS.Chart("users-age-bar-chart", {
      animationEnabled: true,
      backgroundColor: "transparent",
      axisX: {
        labelFontColor: "#f7f6f6",
        labelFontSize: 12,
        labelAngle: 0,
        lineThickness: 0,
        tickThickness: 0
      },
      axisY: {
        gridThickness: 0,
        lineThickness: 0,
        tickThickness: 0,
        valueFormatString: " "

      },
      toolTip: {
        backgroundColor: "#ffffff",
        borderThickness: 0,
        cornerRadius: 0,
        fontColor: "#424242",
        contentFormatter: function (e) {
          return e.entries[0].dataPoint.label + ": " +  CanvasJS.formatNumber(Math.round(e.entries[0].dataPoint.y / 100 * totalUsers), '###,###'); // calculating and showing country wise number of users inside tooltip
        }
      },
      data: [{
        type: "column",
        showInLegend: true,
        name: "Infections",
        color: "grey",
        dataPoints: dataPoint[0]
      },
      {
        type: "column",
        showInLegend: true,
        name: "Critical",
        color: "blue",
        dataPoints: dataPoint[1]
      },
      {
        type: "column",
        showInLegend: true,
        name: "Death",
        color: "red",
        dataPoints: dataPoint[2]
      }]
    });
  }
}
const population = 10720000;
var inf_per_chart;
var herd_chart;
var fatality_chart;
var spline_Area;
var critical_chart;
var state_Chart;
var gender_Chart;
var total_inf;
var total_deaths;
var daily_inf;
var daily_deaths;
// Female
var female_cases_chart;
var female_critical_chart;
var female_deaths_chart;
// Male
var male_cases_chart;
var male_critical_chart;
var male_deaths_chart;
// Age
var age_cases_chart;
var age_critical_chart;
var age_deaths_chart;

const covidInst = new covid();
window.onload = function () {
  covidInst.fetch('https://covid-19-greece.herokuapp.com/regions-history', async (data) => {
    this.regions = await data["regions-history"];
    this.regionsDaily = await this.per_day_data(this.regions);
    state_Chart = this.stateChart("users-countries-bar-chart",this.split_data(this.regions[this.regions.length-1].regions,"region_en_name"))
  }),
  covidInst.fetch('https://covid-19-greece.herokuapp.com/gender-distribution', async (data) => {
    this.gender_percentages = await data["gender_percentages"];
    var sex_dist = [];
    sex_dist.push({y: this.gender_percentages.total_males_percentage, label: "Males"});
    sex_dist.push({y: this.gender_percentages.total_females_percentage, label: "Females"});
    gender_Chart = this.doughnutSexChart("sex-doughnut-chart",sex_dist)
  }),

  covidInst.fetch('https://covid-19-greece.herokuapp.com/gender-age-distribution', async (data) => {
    this.total_age_gender_distribution = await data["total_age_gender_distribution"];
    var age_gender_f_cases = [];
    this.age_gender_dist(this.total_age_gender_distribution.females.cases,age_gender_f_cases)
    female_cases_chart = this.ColumnChart("female-cases",age_gender_f_cases)
    var age_gender_f_critical = [];
    this.age_gender_dist(this.total_age_gender_distribution.females.critical,age_gender_f_critical)
    female_critical_chart = this.ColumnChart("female-critical",age_gender_f_critical)
    var age_gender_f_deaths = [];
    this.age_gender_dist(this.total_age_gender_distribution.females.deaths,age_gender_f_deaths)
    female_deaths_chart = this.ColumnChart("female-deaths",age_gender_f_deaths)
    var age_gender_m_cases = [];
    this.age_gender_dist(this.total_age_gender_distribution.males.cases,age_gender_m_cases)
    male_cases_chart = this.ColumnChart("male-cases",age_gender_m_cases)
    var age_gender_m_critical = [];
    this.age_gender_dist(this.total_age_gender_distribution.males.critical,age_gender_m_critical)
    male_critical_chart = this.ColumnChart("male-critical",age_gender_m_critical)
    var age_gender_m_deaths = [];
    this.age_gender_dist(this.total_age_gender_distribution.males.deaths,age_gender_m_deaths)
    male_deaths_chart = this.ColumnChart("male-deaths",age_gender_m_deaths)
  }),
  covidInst.fetch('https://covid-19-greece.herokuapp.com/age-distribution', async (data) => {
    this.age_distribution = await data["age_distribution"];
    var age_dist_cases = [];
    var total = this.age_distribution.total_age_groups.cases["0-17"]+this.age_distribution.total_age_groups.cases["18-39"]+this.age_distribution.total_age_groups.cases["40-64"]+this.age_distribution.total_age_groups.cases["65+"]
    age_dist_cases.push({y: (this.age_distribution.total_age_groups.cases["0-17"]/total)*100, label: "0-17"});
    age_dist_cases.push({y: (this.age_distribution.total_age_groups.cases["18-39"]/total)*100, label: "18-39"});
    age_dist_cases.push({y: (this.age_distribution.total_age_groups.cases["40-64"]/total)*100, label: "40-64"});
    age_dist_cases.push({y: (this.age_distribution.total_age_groups.cases["65+"]/total)*100, label: "65+"});
    age_cases_chart = this.doughnutSexChart("age-cases-doughnut-chart",age_dist_cases)

    var age_dist_critical = [];
    var total = this.age_distribution.total_age_groups.critical["0-17"]+this.age_distribution.total_age_groups.critical["18-39"]+this.age_distribution.total_age_groups.critical["40-64"]+this.age_distribution.total_age_groups.critical["65+"]
    age_dist_critical.push({y: (this.age_distribution.total_age_groups.critical["0-17"]/total)*100, label: "0-17"});
    age_dist_critical.push({y: (this.age_distribution.total_age_groups.critical["18-39"]/total)*100, label: "18-39"});
    age_dist_critical.push({y: (this.age_distribution.total_age_groups.critical["40-64"]/total)*100, label: "40-64"});
    age_dist_critical.push({y: (this.age_distribution.total_age_groups.critical["65+"]/total)*100, label: "65+"});
    age_critical_chart = this.doughnutSexChart("age-critical-doughnut-chart",age_dist_critical)

    var age_dist_deaths = [];
    var total = this.age_distribution.total_age_groups.deaths["0-17"]+this.age_distribution.total_age_groups.deaths["18-39"]+this.age_distribution.total_age_groups.deaths["40-64"]+this.age_distribution.total_age_groups.deaths["65+"]
    age_dist_deaths.push({y: (this.age_distribution.total_age_groups.deaths["0-17"]/total)*100, label: "0-17"});
    age_dist_deaths.push({y: (this.age_distribution.total_age_groups.deaths["18-39"]/total)*100, label: "18-39"});
    age_dist_deaths.push({y: (this.age_distribution.total_age_groups.deaths["40-64"]/total)*100, label: "40-64"});
    age_dist_deaths.push({y: (this.age_distribution.total_age_groups.deaths["65+"]/total)*100, label: "65+"});
    age_deaths_chart = this.doughnutSexChart("age-deaths-doughnut-chart",age_dist_deaths)
  }),
  covidInst.fetch('https://covid-19-greece.herokuapp.com/intensive-care', async (data) => {
    this.cases = await data["cases"];
    critical_chart = this.splineArea("daily-critical-infections-area-chart",this.split_data(this.cases,"intensive_care"))
    document.getElementById("daily-critical-infections").innerHTML = this.cases[this.cases.length-1].intensive_care;
    document.getElementById("daily-critical-infections-14").innerHTML = "Change 14 days: " + Math.floor(((this.cases[this.cases.length-1].intensive_care)*100)/this.cases[this.cases.length-14].intensive_care)*10/10+"%";
    document.getElementById("daily-critical-infections-30").innerHTML = "Change 30 days: " + Math.floor(((this.cases[this.cases.length-1].intensive_care)*100)/this.cases[this.cases.length-30].intensive_care)*10/10+"%";

  })

  covidInst.fetch('https://covid-19-greece.herokuapp.com/all', async (data) => {
    this.all = await this.ignore_early_dates(data.cases)
    //
    document.getElementById("new-cases").innerHTML = this.all[this.all.length-1].confirmed-this.all[this.all.length-2].confirmed;
    document.getElementById("last-updated").innerHTML = "Last updated: "+this.all[this.all.length-1].date

    document.getElementById("total-infections").innerHTML = this.all[this.all.length-1].confirmed;
    document.getElementById("total-infections-14").innerHTML = "Change 14 days: " + Math.floor(((this.all[this.all.length-1].confirmed)*100)/this.all[this.all.length-14].confirmed)*10/10+"%";
    document.getElementById("total-infections-30").innerHTML = "Change 30 days: " + Math.floor(((this.all[this.all.length-1].confirmed)*100)/this.all[this.all.length-30].confirmed)*10/10+"%";
    document.getElementById("total-deaths").innerHTML = this.all[this.all.length-1].deaths;
    document.getElementById("total-deaths-14").innerHTML = "Change 14 days: " + Math.floor(((this.all[this.all.length-1].deaths)*100)/this.all[this.all.length-14].deaths)*10/10+"%";
    document.getElementById("total-deaths-30").innerHTML = "Change 30 days: " + Math.floor(((this.all[this.all.length-1].deaths)*100)/this.all[this.all.length-30].deaths)*10/10+"%";
    //
    inf_per_chart = this.doughnutChart("infected-doughnut-chart", Math.floor((this.all[this.all.length-1].confirmed / population)*1000) / 1000);
    inf_per_chart.render();
    herd_chart = this.doughnutChart("herd-doughnut-chart", Math.floor((this.all[this.all.length-1].confirmed / (population*0.7))*1000) / 1000);
    herd_chart.render();
    fatality_chart = this.doughnutChart("fatality-doughnut-chart", Math.floor((this.all[this.all.length-1].deaths / (this.all[this.all.length-1].confirmed))*100000) / 1000);
    fatality_chart.render();
    this.allDaily = await this.per_day_data(this.all);
    //
    document.getElementById("daily-infections").innerHTML = this.allDaily[this.allDaily.length-1].confirmed;
    document.getElementById("daily-infections-14").innerHTML = "Change 14 days: " + Math.floor(((this.allDaily[this.allDaily.length-1].confirmed)*100)/this.allDaily[this.allDaily.length-14].confirmed)*10/10+"%";
    document.getElementById("daily-infections-30").innerHTML = "Change 30 days: " + Math.floor(((this.allDaily[this.allDaily.length-1].confirmed)*100)/this.allDaily[this.allDaily.length-30].confirmed)*10/10+"%";
    document.getElementById("daily-infections").innerHTML = this.allDaily[this.allDaily.length-1].confirmed;
    document.getElementById("daily-deaths").innerHTML = this.allDaily[this.allDaily.length-1].deaths;
    document.getElementById("daily-deaths-14").innerHTML = "Change 14 days: " + Math.floor(((this.allDaily[this.allDaily.length-1].deaths)*100)/this.allDaily[this.allDaily.length-14].deaths)*10/10+"%";
    document.getElementById("daily-deaths-30").innerHTML = "Change 30 days: " + Math.floor(((this.allDaily[this.allDaily.length-1].deaths)*100)/this.allDaily[this.allDaily.length-30].deaths)*10/10+"%";
    //
    total_inf = this.splineArea("total-infections-spline-area-chart",this.split_data(this.all,"confirmed"))
    total_deaths = this.splineArea("total-deaths-spline-area-chart",this.split_data(this.all,"deaths"))
    daily_inf = this.splineArea("daily-infections-spline-area-chart",this.split_data(this.allDaily,"confirmed"))
    daily_deaths = this.splineArea("daily-deaths-spline-area-chart",this.split_data(this.allDaily,"deaths"))
  })

  $('.inview').one('inview', function (e, isInView) {
    if (isInView) {

      switch (this.id) {
         case "sex-doughnut-chart": gender_Chart.render();
         break;
         case "female-cases": female_cases_chart.render();
         break;
         case "female-critical": female_critical_chart.render();
         break;
         case "female-deaths": female_deaths_chart.render();
         break;
         case "male-cases": male_cases_chart.render();
         break;
         case "male-critical": male_critical_chart.render();
         break;
         case "male-deaths": male_deaths_chart.render();
         break;
         case "age-cases-doughnut-chart": age_cases_chart.render();
         break;
         case "age-critical-doughnut-chart": age_critical_chart.render();
         break;
         case "age-deaths-doughnut-chart": age_deaths_chart.render();
         break;
         case "daily-critical-infections-area-chart": critical_chart.render();
         break;
         case "total-infections-spline-area-chart": total_inf.render();
         break;
         case "total-deaths-spline-area-chart": total_deaths.render();
         break;
         case "daily-infections-spline-area-chart": daily_inf.render();
         break;
         case "daily-deaths-spline-area-chart": daily_deaths.render();
         break;
         case "users-countries-bar-chart": state_Chart.render();
         break;
      }
    }
  });
}
