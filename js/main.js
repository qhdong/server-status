$(function () {
   'use strict';

    var config = {
       statusURL: 'http://115.159.83.89:8080/status'
    };

    function displayStatus(status) {
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                left: 'center',
                text: `统计样本总数：${status.total}`
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['样本数量'],
                left: 'right'
            },
            xAxis: [{
                type: 'category',
                data: status.users,
                axisTick: {
                    alignWithLabel: true
                }
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: '样本数量',
                type: 'bar',
                barWidth: '60%',
                data: status.counts
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = function () {
            var $chart = document.getElementById('main');
            $chart.style.width = window.innerWidth * 0.9 + 'px';
            $chart.style.height = window.innerHeight * 0.9 + 'px';
            myChart.resize();
        };
    }

    /**
     * 通过Ajax从服务器获取PINS数据，使用jsonp格式
     * @param url
     * @returns {Promise} 返回pins数组
     */
    function getStatusFromServer(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: 'GET',
                url: url,
                dataType: 'jsonp'
            })
                .done((data) => {
                    resolve(getStatus(data));
                });
        });
    }

    function getStatus(data) {
        var users = [],
            counts = [],
            total = 0;
        data.forEach((curr) => {
            users.push(curr.username);
            counts.push(curr.count);
            total += parseInt(curr.count);
        });
        return {
            users: users,
            counts: counts,
            total: total
        };
    }

    getStatusFromServer(config.statusURL)
        .then((status) => {
            console.log(status);
            displayStatus(status);
        });
});
