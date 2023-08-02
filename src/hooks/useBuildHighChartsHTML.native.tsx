import * as Highcharts from 'highcharts';

const useBuildHighChartsHTML = (options: Highcharts.Options): string => {
    const flattenText = (item): string => {
        let str = '';
        if (item && typeof item === 'object' && item.length === undefined) {
            str += flattenObject(item);
        } else if (item && typeof item === 'object' && item.length !== undefined) {
            str += '[';
            item.forEach(function (k2) {
                str += `${flattenText(k2)}, `;
            });
            if (item.length > 0) str = str.slice(0, str.length - 2);
            str += ']';
        } else if (typeof item === 'string' && item.slice(0, 8) === 'function') {
            str += `${item}`;
        } else if (typeof item === 'string') {
            str += `\"${item.replace(/"/g, '\\"')}\"`;
        } else {
            str += `${item}`;
        }
        return str;
    };
    const flattenObject = (obj, str = '{'): string => {
        Object.keys(obj).forEach(function (key) {
            str += `${key}: ${flattenText(obj[key])}, `;
        });
        return `${str.slice(0, str.length - 2)}}`;
    };
    const configStr = JSON.stringify(options, (key, value) => (typeof value === 'function' ? value.toString() : value));
    const parsedConfig = JSON.parse(configStr);

    return `<html>
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />     
      <head>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/drilldown.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            Highcharts.chart('container', ${flattenText(parsedConfig)});
          });
        </script>
      </head>
      <body>
        <div id="container"></div>
      </body>
    </html>`;
};

export default useBuildHighChartsHTML;
