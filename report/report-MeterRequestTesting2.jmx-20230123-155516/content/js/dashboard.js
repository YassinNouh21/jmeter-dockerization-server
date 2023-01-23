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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35344827586206895, 300, 800, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 300, 800, "Add Communication Modules(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_technician"], "isController": false}, {"data": [0.0, 300, 800, "Add User leco_dgm"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_technician"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_ce"], "isController": false}, {"data": [1.0, 300, 800, "View SIM Cards"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_ce"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_css"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Anteleco - NMD"], "isController": false}, {"data": [0.0, 300, 800, "Attach Communication Modules(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Attach SIM Cards(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Add User testlab_technician"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Iskra - IEC Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Anteleco - IEC 3Phase"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Microstar - IEC Bulk"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - DLMS 3Phase"], "isController": false}, {"data": [1.0, 300, 800, "Get Com Module Types"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - IEC SinglePhase"], "isController": false}, {"data": [1.0, 300, 800, "View User Roles"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_se"], "isController": false}, {"data": [0.0, 300, 800, "Application Register"], "isController": false}, {"data": [1.0, 300, 800, "Generate Token"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_to"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Anteleco - DLMS 3Phase"], "isController": false}, {"data": [0.0, 300, 800, "Add User leco_agm"], "isController": false}, {"data": [0.5, 300, 800, "Role Management"], "isController": true}, {"data": [1.0, 300, 800, "Get Configured State Meters"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  IEC 3Phase"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters - MicroStar - DLMS Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Add User testlab_se"], "isController": false}, {"data": [0.0, 300, 800, "Add SIM Card(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_ee"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - NMD"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  MicroStar - DLMS Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters - Anteleco - DLMS SinglePhase"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_ee"], "isController": false}, {"data": [1.0, 300, 800, "View Users"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - DLMS SinglePhase"], "isController": false}, {"data": [0.0, 300, 800, "Add User testlab_ce"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Iskra - IEC Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Prepare Devices - 1"], "isController": true}, {"data": [1.0, 300, 800, "Get User Details"], "isController": false}, {"data": [0.0, 300, 800, "User Management"], "isController": true}, {"data": [1.0, 300, 800, "View Communication Module"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_se"], "isController": false}, {"data": [1.0, 300, 800, "Activate Communication(Bulk)"], "isController": false}, {"data": [0.0, 300, 800, "Add User moratuwa_to"], "isController": false}, {"data": [0.0, 300, 800, "Add Power Meters(Bulk) - Anteleco - IEC SinglePhase"], "isController": false}, {"data": [0.0, 300, 800, "Add User test_user"], "isController": false}, {"data": [1.0, 300, 800, "Update User Details"], "isController": false}, {"data": [1.0, 300, 800, "Upload Credentials(Bulk) -  Anteleco - IEC Bulk"], "isController": false}, {"data": [0.0, 300, 800, "Add User galle_css"], "isController": false}, {"data": [0.0, 300, 800, "Add User testlab_to"], "isController": false}, {"data": [1.0, 300, 800, "View Meters"], "isController": false}, {"data": [0.0, 300, 800, "Obtain Token"], "isController": true}, {"data": [0.0, 300, 800, "Change Meter Status from CONFIGURED to UNCLAIMED"], "isController": false}, {"data": [1.0, 300, 800, "Get Details of a Role"], "isController": false}, {"data": [0.0, 300, 800, "Add User leco_gm"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 54, 33, 61.111111111111114, 46.55555555555555, 8, 1089, 79.5, 119.0, 1089.0, 15.477214101461737, 31.806996094869593, 10.581806212381771], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add Communication Modules(Bulk)", 1, 1, 100.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 86.03766025641026, 12.99579326923077], "isController": false}, {"data": ["Add User galle_technician", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 39.81370192307693, 42.51802884615385], "isController": false}, {"data": ["Add User leco_dgm", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.64062500000001, 65.6467013888889], "isController": false}, {"data": ["Add User moratuwa_technician", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 52.05078125, 55.56640625], "isController": false}, {"data": ["Add User moratuwa_ce", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 11.494252873563218, 5.893049568965518, 6.207345545977012], "isController": false}, {"data": ["View SIM Cards", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 164.81854838709677, 6.961945564516129], "isController": false}, {"data": ["Add User galle_ce", 1, 1, 100.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 62.5, 31.8603515625, 33.5693359375], "isController": false}, {"data": ["Add User moratuwa_css", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 39.51322115384615, 41.69170673076923], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - NMD", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.26953125, 37.40234375], "isController": false}, {"data": ["Attach Communication Modules(Bulk)", 1, 1, 100.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 43.47826086956522, 20.168138586956523, 15.200407608695652], "isController": false}, {"data": ["Attach SIM Cards(Bulk)", 1, 1, 100.0, 72.0, 72, 72, 72.0, 72.0, 72.0, 13.888888888888888, 22.325303819444446, 8.612738715277779], "isController": false}, {"data": ["Add User testlab_technician", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 57.72569444444445, 67.49131944444444], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Iskra - IEC Bulk", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 29.78515625, 29.622395833333332], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC 3Phase", 1, 1, 100.0, 16.0, 16, 16, 16.0, 16.0, 16.0, 62.5, 32.04345703125, 23.37646484375], "isController": false}, {"data": ["Add Power Meters(Bulk) - Microstar - IEC Bulk", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.966145833333336, 41.55815972222223], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - DLMS 3Phase", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 22.231158088235293, 22.288602941176467], "isController": false}, {"data": ["Get Com Module Types", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 35.714285714285715, 44.677734375, 8.858816964285714], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - IEC SinglePhase", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 21.024816176470587, 20.909926470588236], "isController": false}, {"data": ["View User Roles", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 10.0, 9.697265625, 2.412109375], "isController": false}, {"data": ["Add User moratuwa_se", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.62109375, 38.57421875], "isController": false}, {"data": ["Application Register", 1, 0, 0.0, 1089.0, 1089, 1089, 1089.0, 1089.0, 1089.0, 0.9182736455463728, 0.3309013429752066, 0.32014032369146006], "isController": false}, {"data": ["Generate Token", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 21.73913043478261, 164.14741847826087, 296.57778532608694], "isController": false}, {"data": ["Add User galle_to", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.64062500000001, 59.67881944444445], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - DLMS 3Phase", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 62.67755681818182, 38.26349431818182], "isController": false}, {"data": ["Add User leco_agm", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 63.720703125, 73.2421875], "isController": false}, {"data": ["Role Management", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 2.985074626865672, 149.17502332089552, 1.4692164179104477], "isController": true}, {"data": ["Get Configured State Meters", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 92.61067708333333, 20.5078125], "isController": false}, {"data": ["Upload Credentials(Bulk) -  IEC 3Phase", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 35.7421875, 35.3515625], "isController": false}, {"data": ["Add Power Meters - MicroStar - DLMS Bulk", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 42.724609375, 31.168619791666664], "isController": false}, {"data": ["Add User testlab_se", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 63.96484375, 73.8525390625], "isController": false}, {"data": ["Add SIM Card(Bulk)", 1, 1, 100.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 14.084507042253522, 43.46390845070423, 10.192011443661972], "isController": false}, {"data": ["Add User moratuwa_ee", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 64.0869140625, 67.5048828125], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - NMD", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 19.856770833333336, 19.74826388888889], "isController": false}, {"data": ["Upload Credentials(Bulk) -  MicroStar - DLMS Bulk", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 35.7421875, 35.546875], "isController": false}, {"data": ["Add Power Meters - Anteleco - DLMS SinglePhase", 1, 1, 100.0, 23.0, 23, 23, 23.0, 23.0, 23.0, 43.47826086956522, 22.29110054347826, 16.261888586956523], "isController": false}, {"data": ["Add User galle_ee", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 63.720703125, 67.138671875], "isController": false}, {"data": ["View Users", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 22.22222222222222, 73.15538194444444, 5.360243055555555], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - DLMS SinglePhase", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 9.523809523809526, 3.599330357142857, 3.6086309523809526], "isController": false}, {"data": ["Add User testlab_ce", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.85763888888889, 65.4296875], "isController": false}, {"data": ["Add Power Meters(Bulk) - Iskra - IEC Bulk", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.966145833333336, 41.55815972222223], "isController": false}, {"data": ["Prepare Devices - 1", 1, 1, 100.0, 937.0, 937, 937, 937.0, 937.0, 937.0, 1.0672358591248667, 41.051060565635005, 11.035052027748131], "isController": true}, {"data": ["Get User Details", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 46.77734375, 24.70703125], "isController": false}, {"data": ["User Management", 1, 1, 100.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 1.5174506828528074, 22.192716236722305, 18.356114852048556], "isController": true}, {"data": ["View Communication Module", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 24.390243902439025, 121.04611280487805, 5.835556402439024], "isController": false}, {"data": ["Add User galle_se", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 28.320312500000004, 29.839409722222225], "isController": false}, {"data": ["Activate Communication(Bulk)", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 21.73913043478261, 10.805876358695652, 9.659476902173914], "isController": false}, {"data": ["Add User moratuwa_to", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 51.26953125, 54.00390625], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC SinglePhase", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 39.43810096153846, 28.771033653846157], "isController": false}, {"data": ["Add User test_user", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.74913194444445, 59.895833333333336], "isController": false}, {"data": ["Update User Details", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 21.34967672413793, 14.917834051724137], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - IEC Bulk", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 23.828125, 23.697916666666668], "isController": false}, {"data": ["Add User galle_css", 1, 1, 100.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 111.1111111111111, 56.74913194444445, 59.895833333333336], "isController": false}, {"data": ["Add User testlab_to", 1, 1, 100.0, 8.0, 8, 8, 8.0, 8.0, 8.0, 125.0, 63.96484375, 73.8525390625], "isController": false}, {"data": ["View Meters", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 223.3688766891892, 6.176097972972974], "isController": false}, {"data": ["Obtain Token", 1, 0, 0.0, 1635.0, 1635, 1635, 1635.0, 1635.0, 1635.0, 0.6116207951070336, 4.838613340978593, 8.557315558103976], "isController": true}, {"data": ["Change Meter Status from CONFIGURED to UNCLAIMED", 1, 1, 100.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 40.43970352564103, 15.124198717948717], "isController": false}, {"data": ["Get Details of a Role", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 6.211180124223602, 304.37208850931677, 1.5588606366459627], "isController": false}, {"data": ["Add User leco_gm", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 39.13762019230769, 44.921875], "isController": false}]}, function(index, item){
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
