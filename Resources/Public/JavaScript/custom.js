// JavaScript Document for Yahoo Finance
(function () {
    var _global = {
        settings: as_settings
    };

    $(document).ready(function () {
        sort_obj(_global);
        $('.finance-data').remove();
    });

    function sort_obj(global){
        var keys = [];
        for( var key in global.settings) {
            keys.push(key);
        }

        $.each(keys, function(index,key){
            global.settings[key].style == "chart" ? getChartData(global.settings[key]) : getNoChartData(global.settings[key]);
        });
    }

    function getNoChartData(settings){
        $.ajaxSetup({
            'cache': true
        });

        $.ajax({
                url: "//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('" + settings.names + "')%0A%09%09&env=http://datatables.org/alltables.env&format=json",
                dataType: "jsonp",
                jsonp: "callback"
            })
            .done(function (data) {
                var dataForNoChart = processingNoChartData(data);
                initNoChart(dataForNoChart, settings);
            })
            .fail(function (jqXHR, textStatus) {
                getNullChart(settings);
                //console.log("Request failed: " + textStatus);
            });
    }

    function getNullChart(settings){
        var cartID = "#chartdiv"+settings.uid;
        $(cartID).css("background-image", "url('https://chart.finance.yahoo.com/t?s=%5eW1DO&lang=de-DE&region=DE')");
        $(cartID).css("background-repeat", "no-repeat");
        $(cartID).css("background-position", "50%");
}

    function processingNoChartData(data){
        var keys = [];
        var dataForNoChart = [];

        for( var key in data.query.results.quote) {
            keys.push(key);
        }
        $.each(keys, function(index,key){
            dataForNoChart.push(data.query.results.quote[key]);
        });

        return dataForNoChart;
    }

    function initNoChart(data, settings){
        var noCartID = '#noCart'+settings.uid;

        $.each(data, function() {
            var result = proccessingNoChartData(this);
            var mylist = $('<tr/>');
            if (result.Top) mylist.addClass('top');
            $('<td/>',{
                    html: result.Name
                }).appendTo(mylist);

            $('<td/>',{
                text: this.LastTradePriceOnly
            }).appendTo(mylist);

            $('<td/>',{
                text: this.PercentChange
            }).appendTo(mylist);
            $('.noChartData'+settings.uid).append(mylist);
        });
    }

    function proccessingNoChartData(data){

        var result = [];

        //var result = checkName(data.Name);
        result.Name = checkName(data.Name);
        result.Top = checkTop(data.ChangeinPercent);
        //result.LastTradePriceOnly = checkFloat(data.LastTradePriceOnly, "price");
        //result.PercentChange = checkFloat(data.PercentChange, "percent");

        return result;
    }

    function checkFloat(num, type){
        var result = [];
        num = parseFloat(num);
        if(num >= 0){
            typ = 1;
            type == "price" ? num = num.toFixed(2) : num = "+" + num.toFixed(2) + " %";
        }else{
            typ = 0;
            type == "price" ? num = num.toFixed(2) : num = num.toFixed(2) + " %";
        }
        result.value = num;
        result.type = typ;

        return result;
    }

    function checkTop(persent){
        if(persent){
            var persent = persent[0];
            if(persent == "+"){
                return 1;
            }else return 0;
        }else return 0;
    }

    function checkName(name){
        var result = [];
        result = "";
        if(name){
            var name = name.split(' ');
            name.forEach(function(item){
                if((result.length + item.length) <= 12){
                    result = result+' '+item;
                }
            });

            if (result.length == 0)  result = name[0];
            return result;
        }else{
            return "No statistic";
        }
    }

    function getChartData(settings) {
        $.ajax({
                url: "//chartapi.finance.yahoo.com/instrument/1.0/"+settings.name+"/chartdata;type=quote;range="+settings.days+"d/json",
                dataType: "jsonp"
            })
            .done(function (data) {
                settings = setDefaultOptions(settings);
                var dataForAmChart = processingAmChartData(data);
                settings.theme == "custom" ? initCustomAmChart(dataForAmChart, settings) : initAmChart(dataForAmChart, settings);

            })
            .fail(function (jqXHR, textStatus) {
                getNullChart(settings);
                //console.log("Request failed: " + textStatus);
            });
    }

    function setDefaultOptions(settings) {

        if (!settings.days) settings.days = "1";
        if (!settings.fontSize) settings.fontSize = 14;
        if (settings.width<450) settings.name ='';
        if (!settings.positionY) settings.positionY ='right';

        settings.days = Number(settings.days);
        settings.fontSize = Number(settings.fontSize);
        settings.pointSwitcher = Number(settings.pointSwitcher);
        settings.showTooltips = Number(settings.showTooltips);
        settings.showScrollbar = Number(settings.showScrollbar);
        settings.scaleShowGridLines = Number(settings.scaleShowGridLines);
        return settings;
    }

    function processingAmChartData(financeData) {
        var proccessingData = [];
        financeData.series.forEach(function (item) {
            var amCart = {
                date: getCurrentDateForAmChart(item),
                value: item.close
            };
            proccessingData.push(amCart);
        });
        return proccessingData;
    }

    function getCurrentDateForAmChart(item) {
        return dateObj = new Date(item.Timestamp * 1000);
    }



    function initCustomAmChart(chartData, settings){
        settings.scrollbarHeight = settings.height*0.1;
        var cartID = "chartdiv"+settings.uid;
        var chart = AmCharts.makeChart(cartID, {
            "type": "serial",
            "theme": settings.theme,
            "marginRight": 2,
            "dataProvider": chartData,
            "valueAxes": [{
                "position": settings.positionY,
                "title": settings.name,
                "fontSize": settings.fontSize,
                "color": settings.fontColor,
            }],
            "graphs": [{
                "id": "g1",
                "fillColors": settings.fillColor,
                "lineColor": settings.fillColor,
                "fillAlphas": 0.6,
                "valueField": "value",
            }],
            "chartScrollbar": {
                "graph": "g1",
                "enabled": settings.showScrollbar,
                "scrollbarHeight": settings.scrollbarHeight,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.3,
                "selectedBackgroundColor": settings.scrollbarSelectedBackground,
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount": true,
                "color": settings.fontColor,
                "fontSize": settings.fontSize,
            },
            "chartCursor": {
                "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
                "cursorPosition": "mouse",
                "valueBalloonsEnabled": settings.showTooltips,
                "cursorColor": settings.cursorColor,
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "fontSize": settings.fontSize,
                "color": settings.fontColor,
                "parseDates": true
            },
            "export": {
                "enabled": true
            }
        });

        chart.addListener("dataUpdated", zoomChart);
        zoomChart();
        function zoomChart() {
            if(chartData.length>180){
                chart.zoomToIndexes(chartData.length - 170, chartData.length);
            }
        }
    }

    function initAmChart(chartData, settings){
        settings.scrollbarHeight = settings.height*0.1;
        var cartID = "chartdiv"+settings.uid;
        var chart = AmCharts.makeChart(cartID, {
            "type": "serial",
            "theme": settings.theme,
            "marginRight": 2,
            "dataProvider": chartData,
            "valueAxes": [{
                "position": settings.positionY,
                "title": settings.name,
                "fontSize": settings.fontSize,
            }],
            "graphs": [{
                "id": "g1",
                "fillColors": settings.fillColor,
                "lineColor": settings.fillColor,
                "fillAlphas": 0.6,
                "valueField": "value",
                "balloonText": "<div style='margin:2px; font-size:"+settings.fontSize+"px;'><b>[[value]]</b></div>"
            }],
            "chartScrollbar": {
                "graph": "g1",
                "enabled": settings.showScrollbar,
                "scrollbarHeight": settings.scrollbarHeight,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.3,
                "selectedBackgroundColor": settings.scrollbarSelectedBackground,
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount": true,
                "fontSize": settings.fontSize,
            },
            "chartCursor": {
                "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
                "cursorPosition": "mouse",
                "valueBalloonsEnabled": settings.showTooltips,
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true,
                "fontSize": settings.fontSize,
            },
            "export": {
                "enabled": true
            }
        });

        chart.addListener("dataUpdated", zoomChart);
        zoomChart();
        function zoomChart() {
            if(chartData.length>180){
                chart.zoomToIndexes(chartData.length - 170, chartData.length);
            }
        }
    }

})();