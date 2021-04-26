jQuery(function() {
    if (window.wpApiShare.url_path.startsWith( 'metrics/combined/time_charts' )) {
        projectTimeCharts()
    }
})

function escapeObject(obj) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => {
        return [ key, window.lodash.escape(value)]
    }))
}

function projectTimeCharts() {

    const chartDiv = document.querySelector('#chart')
    const {
        title_time_charts,
        post_type_select_label,
        post_field_select_label,
        total_label,
        added_label,
        tooltip_label,
    } = escapeObject(dtMetricsProject.translations)

    const {
        post_type: postType,
        field,
        chart_view: view,
        year,
    } = dtMetricsProject.state

    const tooltipLabel = tooltip_label.replace('%1$s', '{name}').replace('%2$s', '{categoryX}')

    const postTypeOptions = escapeObject(dtMetricsProject.select_options.post_type_select_options)
    const postFieldOptions = escapeObject(dtMetricsProject.select_options.post_field_select_options)

    jQuery('#metrics-sidemenu').foundation('down', jQuery('#combined-menu'));

    chartDiv.innerHTML = `
        <div class="section-header"> ${title_time_charts} </div>
        <section class="chart-controls">
            <label class="section-subheader" for="post-type-select"> ${post_type_select_label} </label>
            <select class="select-field" id="post-type-select">
                ${ Object.entries(postTypeOptions).map(([value, label]) => `
                    <option value="${value}"> ${label} </option>
                `) }
            </select>
            <label class="section-subheader" for="post-field-select">${post_field_select_label}</label>
            <select class="select-field" id="post-field-select">
                ${ Object.entries(postFieldOptions).map(([value, label]) => `
                    <option value="${value}"> ${label} </option>
                `) }
            </select>
        </section>
        <hr>
        <section id="chartdiv" class="timechart"></section>
    `

    const chartSection = document.querySelector('#chartdiv')
    chartSection.addEventListener('datachange', () => {
        createChart(view, { total_label, tooltipLabel, added_label})
    })
    if (view === 'month') {
        getMonthData(chartSection, postType, field, year)
    }
}

function createChart(view, { total_label, tooltipLabel, added_label}) {

    const chartSection = document.querySelector('#chartdiv')
    am4core.useTheme(am4themes_animated);

    const chart = am4core.create(chartSection, am4charts.XYChart)
    const data = dtMetricsProject.data

    const categoryAxis = chart.xAxes.push( new am4charts.CategoryAxis() )
    categoryAxis.dataFields.category = view

    const valueAxis = chart.yAxes.push( new am4charts.ValueAxis() )

    const columnSeries = chart.series.push( new am4charts.ColumnSeries() )
    columnSeries.name = total_label
    columnSeries.dataFields.valueY = 'cumulativeTotal'
    columnSeries.dataFields.categoryX = view
    columnSeries.columns.template.tooltipText = `[#fff font-size: 15px]${tooltipLabel}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]`
    columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
    columnSeries.columns.template.propertyFields.stroke = "stroke";
    columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
    columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
    columnSeries.tooltip.label.textAlign = "middle";

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.name = added_label
    lineSeries.dataFields.valueY = "count";
    lineSeries.dataFields.categoryX = view

    lineSeries.stroke = am4core.color("#fdd400");
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.strokeDasharray = "lineDash";
    lineSeries.tooltip.label.textAlign = "middle";

    let bullet = lineSeries.bullets.push(new am4charts.Bullet());
    bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
    bullet.tooltipText = `[#fff font-size: 15px]${tooltipLabel}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]`
    let circle = bullet.createChild(am4core.Circle);
    circle.radius = 4;
    circle.fill = am4core.color("#fff");
    circle.strokeWidth = 3;

    chart.data = data
}

function getMonthData(element, postType, field, year) {
    const data = window.API.getTimeMetricsByMonth(postType, field, year)

    data.promise()
        .then((data) => {
            console.log(data)
            window.dtMetricsProject.data = formatMonthData(data)
            const dataChangeEvent = new Event('datachange')
            element.dispatchEvent(dataChangeEvent)
        })
        .catch((error) => {
            console.log(error)
        })

}

function formatMonthData(monthlyData) {
    const monthLabels = window.wpApiShare.translations.month_labels

    let cumulativeTotal = 0
    const formattedMonthlyData = monthLabels.map((monthLabel, i) => {
        const monthNumber = i + 1

        const monthData = monthlyData.find((mData) => mData.month === String(monthNumber) )
        const count = monthData ? parseInt(monthData.count) : 0
        cumulativeTotal = cumulativeTotal + count

        return {
            'month': monthLabel,
            'count': count,
            'cumulativeTotal': cumulativeTotal
        }
    })        
        // search for monthNumber in data
        // if there, add count to cumulative

    return formattedMonthlyData
}