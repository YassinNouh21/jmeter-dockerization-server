/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 38.888888888888886, "KoPercent": 61.111111111111114};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3620689655172414, 300, 800, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 300, 800, "Add Communication Modules(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_technician"], "isController": false}, {"data": [0.0, 300, 800, "Add User leco_dgm"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_technician"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_ce"], "isController": false}, {"data": [1.0, 300, 800, "View SIM Cards"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_ce"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_css"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Anteleco - NMD"], "isController": false}, {"data": [0.0, 300, 800, "Attach Communication Modules(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Attach SIM Cards(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Add User testlab_technician"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Iskra - IEC Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Anteleco - IEC 3Phase"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Microstar - IEC Bulk"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - DLMS 3Phase"], "isController": false}, {"data": [1.0, 300, 800, "Get Com Module Types"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - IEC SinglePhase"], "isController": false}, {"data": [1.0, 300, 800, "View User Roles"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_se"], "isController": false}, {"data": [0.0, 300, 800, "Application Register"], "isController": false}, {"data": [1.0, 300, 800, "Generate Token"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_to"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Anteleco - DLMS 3Phase"], "isController": false}, {"data": [0.0, 300, 800, "Add User leco_agm"], "isController": false}, {"data": [1.0, 300, 800, "Role Management"], "isController": true}, {"data": [1.0, 300, 800, "Get Configured State Meters"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  IEC 3Phase"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters - MicroStar - DLMS Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Add User testlab_se"], "isController": false}, {"data": [0.0, 300, 800, "Add SIM Card(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_ee"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - NMD"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  MicroStar - DLMS Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters - Anteleco - DLMS SinglePhase"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_ee"], "isController": false}, {"data": [1.0, 300, 800, "View Users"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - DLMS SinglePhase"], "isController": false}, {"data": [0.0, 300, 800, "Add User testlab_ce"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Iskra - IEC Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Prepare Devices - 1"], "isController": true}, {"data": [1.0, 300, 800, "Get User Details"], "isController": false}, {"data": [0.0, 300, 800, "User Management"], "isController": true}, {"data": [1.0, 300, 800, "View Communication Module"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_se"], "isController": false}, {"data": [1.0, 300, 800, "Activate Communication(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_to"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Anteleco - IEC SinglePhase"], "isController": false}, {"data": [0.0, 300, 800, "Add User test_user"], "isController": false}, {"data": [1.0, 300, 800, "Update User Details"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - IEC Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_css"], "isController": false}, {"data": [0.0, 300, 800, "Add User testlab_to"], "isController": false}, {"data": [1.0, 300, 800, "View Meters"], "isController": false}, {"data": [0.0, 300, 800, "Obtain Token"], "isController": true}, {"data": [0.0, 300, 800, "Change Meter Status from CONFIGURED to UNCLAIMED"], "isController": false}, {"data": [1.0, 300, 800, "Get Details of a Role"], "isController": false}, {"data": [0.0, 300, 800, "Add User leco_gm"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 54, 33, 61.111111111111114, 38.51851851851852, 8, 888, 56.5, 106.25, 888.0, 17.601043024771837, 36.1722824315515, 12.033872840612776], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add Communication Modules(Bulk)", 1, 1, 100.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 108.24092741935483, 16.349546370967744], "isController": false}, {"data": ["Add User galle_technician", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 57.50868055555556, 61.41493055555556], "isController": false}, {"data": ["Add User leco_dgm", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.64062500000001, 65.6467013888889], "isController": false}, {"data": ["Add User moratuwa_technician", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 57.83420138888889, 61.74045138888889], "isController": false}, {"data": ["Add User moratuwa_ce", 1, 1, 100.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 18.98871527777778, 20.00144675925926], "isController": false}, {"data": ["View SIM Cards", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 40.0, 204.375, 8.6328125], "isController": false}, {"data": ["Add User galle_ce", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 50.9765625, 53.7109375], "isController": false}, {"data": ["Add User moratuwa_css", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 57.07465277777778, 60.22135416666667], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - NMD", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.966145833333336, 41.55815972222223], "isController": false}, {"data": ["Attach Communication Modules(Bulk)", 1, 1, 100.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 40.0, 18.5546875, 13.984375], "isController": false}, {"data": ["Attach SIM Cards(Bulk)", 1, 1, 100.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 45.926339285714285, 17.717633928571427], "isController": false}, {"data": ["Add User testlab_technician", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 57.72569444444445, 67.49131944444444], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Iskra - IEC Bulk", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 39.71354166666667, 39.49652777777778], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC 3Phase", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.62109375, 26.71595982142857], "isController": false}, {"data": ["Add Power Meters(Bulk) - Microstar - IEC Bulk", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.26953125, 37.40234375], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - DLMS 3Phase", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 41.9921875, 42.10069444444445], "isController": false}, {"data": ["Get Com Module Types", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 40.0, 50.0390625, 9.921875], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - IEC SinglePhase", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 29.78515625, 29.622395833333332], "isController": false}, {"data": ["View User Roles", 1, 0, 0.0, 64.0, 64, 64, 64.0, 64.0, 64.0, 15.625, 15.1519775390625, 3.7689208984375], "isController": false}, {"data": ["Add User moratuwa_se", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 64.0869140625, 67.5048828125], "isController": false}, {"data": ["Application Register", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 1.1261261261261262, 0.4058013091216216, 0.3926045185810811], "isController": false}, {"data": ["Generate Token", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 15.151515151515152, 114.40577651515152, 206.70572916666666], "isController": false}, {"data": ["Add User galle_to", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 50.9765625, 53.7109375], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - DLMS 3Phase", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 62.67755681818182, 38.26349431818182], "isController": false}, {"data": ["Add User leco_agm", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 42.48046875, 48.828125], "isController": false}, {"data": ["Role Management", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 4.065040650406504, 203.15278836382114, 2.0007621951219514], "isController": true}, {"data": ["Get Configured State Meters", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 79.38058035714286, 17.578125], "isController": false}, {"data": ["Upload Credentials(Bulk) -  IEC 3Phase", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 35.7421875, 35.3515625], "isController": false}, {"data": ["Add Power Meters - MicroStar - DLMS Bulk", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.26953125, 37.40234375], "isController": false}, {"data": ["Add User testlab_se", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.85763888888889, 65.6467013888889], "isController": false}, {"data": ["Add SIM Card(Bulk)", 1, 1, 100.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 110.21205357142857, 25.844029017857142], "isController": false}, {"data": ["Add User moratuwa_ee", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 26.983963815789476, 28.42310855263158], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - NMD", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 39.71354166666667, 39.49652777777778], "isController": false}, {"data": ["Upload Credentials(Bulk) -  MicroStar - DLMS Bulk", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 29.78515625, 29.622395833333332], "isController": false}, {"data": ["Add Power Meters - Anteleco - DLMS SinglePhase", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 24.4140625, 17.81063988095238], "isController": false}, {"data": ["Add User galle_ee", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.64062500000001, 59.67881944444445], "isController": false}, {"data": ["View Users", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 67.18351403061224, 4.922672193877551], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - DLMS SinglePhase", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 9.4482421875, 9.47265625], "isController": false}, {"data": ["Add User testlab_ce", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.85763888888889, 65.4296875], "isController": false}, {"data": ["Add Power Meters(Bulk) - Iskra - IEC Bulk", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.966145833333336, 41.55815972222223], "isController": false}, {"data": ["Prepare Devices - 1", 1, 1, 100.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 1.2165450121654502, 46.794213807785894, 12.578885340632604], "isController": true}, {"data": ["Get User Details", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 51.97482638888889, 27.452256944444446], "isController": false}, {"data": ["User Management", 1, 1, 100.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 1.5552099533437014, 22.744945567651634, 18.812876652410576], "isController": true}, {"data": ["View Communication Module", 1, 0, 0.0, 49.0, 49, 49, 49.0, 49.0, 49.0, 20.408163265306122, 101.28348214285714, 4.8828125], "isController": false}, {"data": ["Add User galle_se", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.64062500000001, 59.67881944444445], "isController": false}, {"data": ["Activate Communication(Bulk)", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 13.43433277027027, 12.009079391891893], "isController": false}, {"data": ["Add User moratuwa_to", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.966145833333336, 60.004340277777786], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC SinglePhase", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 46.60866477272727, 34.00213068181819], "isController": false}, {"data": ["Add User test_user", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 63.8427734375, 67.3828125], "isController": false}, {"data": ["Update User Details", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 15.87540064102564, 11.092748397435898], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - IEC Bulk", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 32.49289772727273, 32.315340909090914], "isController": false}, {"data": ["Add User galle_css", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 24.321056547619047, 25.669642857142854], "isController": false}, {"data": ["Add User testlab_to", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.85763888888889, 65.6467013888889], "isController": false}, {"data": ["View Meters", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 236.13281249999997, 6.529017857142857], "isController": false}, {"data": ["Obtain Token", 1, 0, 0.0, 1475.0, 1475, 1475, 1475.0, 1475.0, 1475.0, 0.6779661016949153, 5.3634798728813555, 9.485566737288135], "isController": true}, {"data": ["Change Meter Status from CONFIGURED to UNCLAIMED", 1, 1, 100.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 10.309278350515465, 16.25926224226804, 6.080863402061856], "isController": false}, {"data": ["Get Details of a Role", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 7.462686567164179, 365.71536847014926, 1.8729594216417909], "isController": false}, {"data": ["Add User leco_gm", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.53211805555556, 64.88715277777779], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_2&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_2&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_5&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_5&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_com_1&quot;,&quot;errorMsg&quot;:&quot;ComModule status change from INA...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_com_1&quot;,&quot;req_test_com_2&quot;,&quot;req_test_com_3&quot;,&quot;req_test_com_4&quot;,&quot;req_test_com_5&quot;,&quot;req_test_com_6...]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_4&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_4&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["409\/Conflict", 20, 60.60606060606061, 37.03703703703704], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_7&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_7&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_6&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_6&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_1&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_1&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[&quot;[[[test_meter_new_1&quot;],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_1&quot;,&quot;errorMsg&quot;:&quot;Only meters w...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[&quot;[[[req_test_meter_1&quot;,&quot;test_meter_new_1&quot;,&quot;req_test_meter_2&quot;,&quot;req_test_meter_3&quot;,&quot;req_test_meter_4&quot;,&quot;req_t...]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;test_meter_new_1&quot;,&quot;errorMsg&quot;:&quot;ComModule status change from I...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;test_meter_new_1&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_8&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_8&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_com_1&quot;,&quot;errorMsg&quot;:&quot;Com Module \\\\u0027req_test_com_1 ...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_com_1&quot;,&quot;req_test_com_2&quot;,&quot;req_test_com_3&quot;,&quot;req_test_com_4&quot;,&quot;req_test_com_5&quot;,&quot;req_test_com_6...]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successSims&quot;:[[[[],&quot;failedSims&quot;:[{&quot;imsi&quot;:&quot;req_test_sim_1&quot;,&quot;errorMsg&quot;:&quot;Sim \\\\u0027req_test_sim_1 already existing. Cann...]]]]}\\n\\n****** comparison: {&quot;successSims&quot;:[[[[&quot;req_test_sim_1&quot;,&quot;req_test_sim_2&quot;,&quot;req_test_sim_3&quot;,&quot;req_test_sim_4&quot;,&quot;req_test_sim_5&quot;,&quot;req_test_sim_6...]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}, {"data": ["Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_3&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_3&quot;,&quot;req_test_meter_9&quot;],&quot;failedDevices&quot;:[                                               ]]]]}\\n\\n\\\/", 1, 3.0303030303030303, 1.8518518518518519], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 54, 33, "409\/Conflict", 20, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_2&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_2&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_5&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_5&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_com_1&quot;,&quot;errorMsg&quot;:&quot;ComModule status change from INA...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_com_1&quot;,&quot;req_test_com_2&quot;,&quot;req_test_com_3&quot;,&quot;req_test_com_4&quot;,&quot;req_test_com_5&quot;,&quot;req_test_com_6...]]]]}\\n\\n\\\/", 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_4&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_4&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Add Communication Modules(Bulk)", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_com_1&quot;,&quot;errorMsg&quot;:&quot;Com Module \\\\u0027req_test_com_1 ...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_com_1&quot;,&quot;req_test_com_2&quot;,&quot;req_test_com_3&quot;,&quot;req_test_com_4&quot;,&quot;req_test_com_5&quot;,&quot;req_test_com_6...]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User galle_technician", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User leco_dgm", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User moratuwa_technician", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User moratuwa_ce", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Add User galle_ce", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User moratuwa_css", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - NMD", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_7&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_7&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Attach Communication Modules(Bulk)", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;test_meter_new_1&quot;,&quot;errorMsg&quot;:&quot;ComModule status change from I...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;test_meter_new_1&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Attach SIM Cards(Bulk)", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_com_1&quot;,&quot;errorMsg&quot;:&quot;ComModule status change from INA...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_com_1&quot;,&quot;req_test_com_2&quot;,&quot;req_test_com_3&quot;,&quot;req_test_com_4&quot;,&quot;req_test_com_5&quot;,&quot;req_test_com_6...]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User testlab_technician", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC 3Phase", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_6&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_6&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add Power Meters(Bulk) - Microstar - IEC Bulk", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_5&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_5&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add User moratuwa_se", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add User galle_to", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - DLMS 3Phase", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_3&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_3&quot;,&quot;req_test_meter_9&quot;],&quot;failedDevices&quot;:[                                               ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User leco_agm", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add Power Meters - MicroStar - DLMS Bulk", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_2&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_2&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User testlab_se", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add SIM Card(Bulk)", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successSims&quot;:[[[[],&quot;failedSims&quot;:[{&quot;imsi&quot;:&quot;req_test_sim_1&quot;,&quot;errorMsg&quot;:&quot;Sim \\\\u0027req_test_sim_1 already existing. Cann...]]]]}\\n\\n****** comparison: {&quot;successSims&quot;:[[[[&quot;req_test_sim_1&quot;,&quot;req_test_sim_2&quot;,&quot;req_test_sim_3&quot;,&quot;req_test_sim_4&quot;,&quot;req_test_sim_5&quot;,&quot;req_test_sim_6...]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User moratuwa_ee", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add Power Meters - Anteleco - DLMS SinglePhase", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_1&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_1&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User galle_ee", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add User testlab_ce", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add Power Meters(Bulk) - Iskra - IEC Bulk", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_8&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_8&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add User galle_se", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Add User moratuwa_to", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC SinglePhase", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[[[[],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_4&quot;,&quot;errorMsg&quot;:&quot;No communication activated SIM...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[[[[&quot;req_test_meter_4&quot;],&quot;failedDevices&quot;:[                                                                  ]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User test_user", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add User galle_css", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Add User testlab_to", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Change Meter Status from CONFIGURED to UNCLAIMED", 1, 1, "Test failed: text expected to equal \\\/\\n\\n****** received  : {&quot;successDevices&quot;:[&quot;[[[test_meter_new_1&quot;],&quot;failedDevices&quot;:[{&quot;deviceIdentifier&quot;:&quot;req_test_meter_1&quot;,&quot;errorMsg&quot;:&quot;Only meters w...]]]]}\\n\\n****** comparison: {&quot;successDevices&quot;:[&quot;[[[req_test_meter_1&quot;,&quot;test_meter_new_1&quot;,&quot;req_test_meter_2&quot;,&quot;req_test_meter_3&quot;,&quot;req_test_meter_4&quot;,&quot;req_t...]]]]}\\n\\n\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Add User leco_gm", 1, 1, "409\/Conflict", 1, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
