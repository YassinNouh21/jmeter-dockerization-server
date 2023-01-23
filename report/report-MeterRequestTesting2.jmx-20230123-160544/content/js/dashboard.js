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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 54, 33, 61.111111111111114, 35.94444444444444, 8, 984, 39.0, 63.5, 984.0, 17.792421746293247, 36.56558896210873, 12.164718904448105], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add Communication Modules(Bulk)", 1, 1, 100.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 152.5213068181818, 23.03799715909091], "isController": false}, {"data": ["Add User galle_technician", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 47.05255681818182, 50.24857954545455], "isController": false}, {"data": ["Add User leco_dgm", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 33.984375, 39.388020833333336], "isController": false}, {"data": ["Add User moratuwa_technician", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 28.917100694444446, 30.870225694444446], "isController": false}, {"data": ["Add User moratuwa_ce", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.966145833333336, 60.004340277777786], "isController": false}, {"data": ["View SIM Cards", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 364.9553571428571, 15.415736607142858], "isController": false}, {"data": ["Add User galle_ce", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 42.48046875, 44.759114583333336], "isController": false}, {"data": ["Add User moratuwa_css", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 46.69744318181819, 49.27201704545455], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - NMD", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.62109375, 26.71595982142857], "isController": false}, {"data": ["Attach Communication Modules(Bulk)", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 38.655598958333336, 29.134114583333332], "isController": false}, {"data": ["Attach SIM Cards(Bulk)", 1, 1, 100.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 48.70975378787879, 18.791429924242422], "isController": false}, {"data": ["Add User testlab_technician", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.953125, 60.7421875], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Iskra - IEC Bulk", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 8.935546875, 8.88671875], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC 3Phase", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 26.983963815789476, 19.68544407894737], "isController": false}, {"data": ["Add Power Meters(Bulk) - Microstar - IEC Bulk", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 34.1796875, 24.934895833333336], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - DLMS 3Phase", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 37.79296875, 37.890625], "isController": false}, {"data": ["Get Com Module Types", 1, 0, 0.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 156.3720703125, 31.005859375], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - IEC SinglePhase", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 39.71354166666667, 39.49652777777778], "isController": false}, {"data": ["View User Roles", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 16.666666666666668, 16.162109375, 4.020182291666667], "isController": false}, {"data": ["Add User moratuwa_se", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.26953125, 54.00390625], "isController": false}, {"data": ["Application Register", 1, 0, 0.0, 984.0, 984, 984, 984.0, 984.0, 984.0, 1.016260162601626, 0.3662109375, 0.3543016387195122], "isController": false}, {"data": ["Generate Token", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 25.0, 188.76953125, 341.064453125], "isController": false}, {"data": ["Add User galle_to", 1, 1, 100.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 23.171164772727273, 24.4140625], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - DLMS 3Phase", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 45.96354166666667, 28.059895833333336], "isController": false}, {"data": ["Add User leco_agm", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.411830357142854, 41.85267857142857], "isController": false}, {"data": ["Role Management", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 4.975124378109452, 248.6347559079602, 2.448694029850746], "isController": true}, {"data": ["Get Configured State Meters", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 92.61067708333333, 20.5078125], "isController": false}, {"data": ["Upload Credentials(Bulk) -  IEC 3Phase", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 32.49289772727273, 32.13778409090909], "isController": false}, {"data": ["Add Power Meters - MicroStar - DLMS Bulk", 1, 1, 100.0, 21.0, 21, 21, 21.0, 21.0, 21.0, 47.61904761904761, 24.4140625, 17.81063988095238], "isController": false}, {"data": ["Add User testlab_se", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.85763888888889, 65.6467013888889], "isController": false}, {"data": ["Add SIM Card(Bulk)", 1, 1, 100.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 140.26988636363637, 32.89240056818182], "isController": false}, {"data": ["Add User moratuwa_ee", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.966145833333336, 60.004340277777786], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - NMD", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 32.49289772727273, 32.315340909090914], "isController": false}, {"data": ["Upload Credentials(Bulk) -  MicroStar - DLMS Bulk", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 32.49289772727273, 32.315340909090914], "isController": false}, {"data": ["Add Power Meters - Anteleco - DLMS SinglePhase", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.26953125, 37.40234375], "isController": false}, {"data": ["Add User galle_ee", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 33.984375, 35.80729166666667], "isController": false}, {"data": ["View Users", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 26.31578947368421, 86.63137335526316, 6.34765625], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - DLMS SinglePhase", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 31.494140625, 31.575520833333332], "isController": false}, {"data": ["Add User testlab_ce", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.171875, 58.88671875], "isController": false}, {"data": ["Add Power Meters(Bulk) - Iskra - IEC Bulk", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 34.1796875, 24.934895833333336], "isController": false}, {"data": ["Prepare Devices - 1", 1, 1, 100.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 1.4992503748125936, 57.66843140929535, 15.502014617691154], "isController": true}, {"data": ["Get User Details", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 46.77734375, 24.70703125], "isController": false}, {"data": ["User Management", 1, 1, 100.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 1.3888888888888888, 20.3125, 16.800944010416668], "isController": true}, {"data": ["View Communication Module", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 496.2890625, 23.92578125], "isController": false}, {"data": ["Add User galle_se", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 46.34232954545455, 48.828125], "isController": false}, {"data": ["Activate Communication(Bulk)", 1, 0, 0.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 26.161595394736842, 23.386101973684212], "isController": false}, {"data": ["Add User moratuwa_to", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 30.158547794117645, 31.767003676470587], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC SinglePhase", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 39.43810096153846, 28.771033653846157], "isController": false}, {"data": ["Add User test_user", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.07421875, 53.90625], "isController": false}, {"data": ["Update User Details", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 18.76183712121212, 13.109611742424242], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - IEC Bulk", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 35.7421875, 35.546875], "isController": false}, {"data": ["Add User galle_css", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 42.561848958333336, 44.921875], "isController": false}, {"data": ["Add User testlab_to", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.85763888888889, 65.6467013888889], "isController": false}, {"data": ["View Meters", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 223.3688766891892, 6.176097972972974], "isController": false}, {"data": ["Obtain Token", 1, 0, 0.0, 1551.0, 1551, 1551, 1551.0, 1551.0, 1551.0, 0.6447453255963894, 5.100665901031593, 9.020767851386204], "isController": true}, {"data": ["Change Meter Status from CONFIGURED to UNCLAIMED", 1, 1, 100.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 38.46153846153847, 60.65955528846154, 22.686298076923077], "isController": false}, {"data": ["Get Details of a Role", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 13.513513513513514, 662.2413429054054, 3.3915751689189193], "isController": false}, {"data": ["Add User leco_gm", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 29.92876838235294, 34.35202205882353], "isController": false}]}, function(index, item){
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
