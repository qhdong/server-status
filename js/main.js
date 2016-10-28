$(function () {
   'use strict';

    var config = {
       statusURL: 'http://115.159.83.89:8080/status'
    };

    getStatusFromServer(config.statusURL)
        .then((status) => {
            console.log(status);
            displayStatus(status);
        });

    function displayStatus(status) {
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                left: 'center',
                text: `参与人数：${status.totalUsers}, 样本总数：${status.totalSamples}`
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
              {
                name: '操作系统',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '60%'],

                label: {
                  normal: {
                    position: 'inner'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: status.osData
            },
            {
              name: '浏览器',
              type: 'pie',
              radius: ['70%', '80%'],
              data: status.browserData
          },
          ]
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
        var totalUsers = 0;
        var browserData = [];
        var osData = [];

        data.status.browser.forEach((curr) => {
          var browser = curr['UAParser.browser'];
          totalUsers += parseInt(curr.count);
          if (browser != null) {
            browserData.push({
              name: browser.name + '-' + browser.major,
              value: curr.count
            });
          }
        });

        data.status.os.forEach((curr) => {
          var os = curr['UAParser.os'];
          if (os != null) {
            osData.push({
              name: os.name + ' ' + os.version,
              value: curr.count
            });
          }
        });

        return {
            totalUsers: totalUsers,
            pinsCount: parseInt(data.pinsCount),
            totalSamples: totalUsers * parseInt(data.pinsCount),
            browserData: browserData,
            osData: osData
        };
    }
});
