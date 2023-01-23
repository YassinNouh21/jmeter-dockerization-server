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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 54, 33, 61.111111111111114, 68.05555555555556, 10, 1480, 126.5, 198.75, 1480.0, 10.15228426395939, 20.86381074920098, 6.941139664410604], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Add Communication Modules(Bulk)", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 9.70873786407767, 32.57736650485437, 4.920737257281553], "isController": false}, {"data": ["Add User galle_technician", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.96986607142857, 39.481026785714285], "isController": false}, {"data": ["Add User leco_dgm", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 50.9765625, 59.08203125], "isController": false}, {"data": ["Add User moratuwa_technician", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 43.375651041666664, 46.305338541666664], "isController": false}, {"data": ["Add User moratuwa_ce", 1, 1, 100.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 16.949152542372882, 8.689751059322035, 9.153204449152543], "isController": false}, {"data": ["View SIM Cards", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 12.987012987012989, 66.35551948051948, 2.8028612012987013], "isController": false}, {"data": ["Add User galle_ce", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 46.34232954545455, 48.828125], "isController": false}, {"data": ["Add User moratuwa_css", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 42.805989583333336, 45.166015625], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - NMD", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.62109375, 26.71595982142857], "isController": false}, {"data": ["Attach Communication Modules(Bulk)", 1, 1, 100.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 24.390243902439025, 11.313833841463413, 8.527057926829269], "isController": false}, {"data": ["Attach SIM Cards(Bulk)", 1, 1, 100.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 18.18181818181818, 29.225852272727273, 11.274857954545455], "isController": false}, {"data": ["Add User testlab_technician", 1, 1, 100.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 15.743371212121211, 18.406723484848484], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Iskra - IEC Bulk", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 19.856770833333336, 19.74826388888889], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC 3Phase", 1, 1, 100.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 16.538558467741936, 12.065272177419354], "isController": false}, {"data": ["Add Power Meters(Bulk) - Microstar - IEC Bulk", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.62109375, 26.71595982142857], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - DLMS 3Phase", 1, 0, 0.0, 34.0, 34, 34, 34.0, 34.0, 34.0, 29.41176470588235, 11.115579044117647, 11.144301470588234], "isController": false}, {"data": ["Get Com Module Types", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 27.027027027027028, 33.81017736486486, 6.703969594594595], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - IEC SinglePhase", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 40.0, 14.296875, 14.21875], "isController": false}, {"data": ["View User Roles", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 5.405405405405405, 5.241765202702703, 1.3038429054054055], "isController": false}, {"data": ["Add User moratuwa_se", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 46.60866477272727, 49.09446022727273], "isController": false}, {"data": ["Application Register", 1, 0, 0.0, 1480.0, 1480, 1480, 1480.0, 1480.0, 1480.0, 0.6756756756756757, 0.24348078547297297, 0.23556271114864866], "isController": false}, {"data": ["Generate Token", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 8.771929824561402, 66.23492324561403, 119.6717379385965], "isController": false}, {"data": ["Add User galle_to", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 50.9765625, 53.7109375], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - DLMS 3Phase", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 49.246651785714285, 30.064174107142858], "isController": false}, {"data": ["Add User leco_agm", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.411830357142854, 41.85267857142857], "isController": false}, {"data": ["Role Management", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 2.0408163265306123, 101.98700573979592, 1.0044642857142858], "isController": true}, {"data": ["Get Configured State Meters", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 50.51491477272727, 11.186079545454547], "isController": false}, {"data": ["Upload Credentials(Bulk) -  IEC 3Phase", 1, 0, 0.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 19.856770833333336, 19.639756944444446], "isController": false}, {"data": ["Add Power Meters - MicroStar - DLMS Bulk", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.62109375, 26.71595982142857], "isController": false}, {"data": ["Add User testlab_se", 1, 1, 100.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 66.66666666666667, 34.114583333333336, 39.388020833333336], "isController": false}, {"data": ["Add SIM Card(Bulk)", 1, 1, 100.0, 139.0, 139, 139, 139.0, 139.0, 139.0, 7.194244604316547, 22.200989208633093, 5.205991456834532], "isController": false}, {"data": ["Add User moratuwa_ee", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 39.43810096153846, 41.54146634615385], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - NMD", 1, 0, 0.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 45.45454545454545, 16.246448863636363, 16.157670454545457], "isController": false}, {"data": ["Upload Credentials(Bulk) -  MicroStar - DLMS Bulk", 1, 0, 0.0, 20.0, 20, 20, 20.0, 20.0, 20.0, 50.0, 17.87109375, 17.7734375], "isController": false}, {"data": ["Add Power Meters - Anteleco - DLMS SinglePhase", 1, 1, 100.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 14.648437499999998, 10.686383928571427], "isController": false}, {"data": ["Add User galle_ee", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 50.9765625, 53.7109375], "isController": false}, {"data": ["View Users", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 17.241379310344826, 56.75848599137931, 4.158809267241379], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - DLMS SinglePhase", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 4.166666666666667, 1.57470703125, 1.5787760416666667], "isController": false}, {"data": ["Add User testlab_ce", 1, 1, 100.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 58.8235294117647, 30.101102941176467, 34.639246323529406], "isController": false}, {"data": ["Add Power Meters(Bulk) - Iskra - IEC Bulk", 1, 1, 100.0, 18.0, 18, 18, 18.0, 18.0, 18.0, 55.55555555555555, 28.483072916666668, 20.779079861111114], "isController": false}, {"data": ["Prepare Devices - 1", 1, 1, 100.0, 1716.0, 1716, 1716, 1716.0, 1716.0, 1716.0, 0.5827505827505828, 22.41541011072261, 6.025549970862471], "isController": true}, {"data": ["Get User Details", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 33.41238839285714, 17.647879464285715], "isController": false}, {"data": ["User Management", 1, 1, 100.0, 849.0, 849, 849, 849.0, 849.0, 849.0, 1.1778563015312131, 17.226148409893995, 14.248150397526501], "isController": true}, {"data": ["View Communication Module", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 18.867924528301884, 93.63944575471699, 4.514298349056604], "isController": false}, {"data": ["Add User galle_se", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 50.9765625, 53.7109375], "isController": false}, {"data": ["Activate Communication(Bulk)", 1, 0, 0.0, 70.0, 70, 70, 70.0, 70.0, 70.0, 14.285714285714285, 7.1010044642857135, 6.347656249999999], "isController": false}, {"data": ["Add User moratuwa_to", 1, 1, 100.0, 19.0, 19, 19, 19.0, 19.0, 19.0, 52.63157894736842, 26.983963815789476, 28.42310855263158], "isController": false}, {"data": ["Add Power Meters(Bulk) - Anteleco - IEC SinglePhase", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 46.60866477272727, 34.00213068181819], "isController": false}, {"data": ["Add User test_user", 1, 1, 100.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 39.28786057692308, 41.46634615384615], "isController": false}, {"data": ["Update User Details", 1, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 21.73913043478261, 13.459578804347826, 9.404721467391305], "isController": false}, {"data": ["Upload Credentials(Bulk) -  Anteleco - IEC Bulk", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 32.25806451612903, 11.529737903225806, 11.466733870967742], "isController": false}, {"data": ["Add User galle_css", 1, 1, 100.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 36.48158482142857, 38.504464285714285], "isController": false}, {"data": ["Add User testlab_to", 1, 1, 100.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 90.9090909090909, 46.51988636363637, 53.7109375], "isController": false}, {"data": ["View Meters", 1, 0, 0.0, 66.0, 66, 66, 66.0, 66.0, 66.0, 15.151515151515152, 125.22194602272727, 3.4623579545454546], "isController": false}, {"data": ["Obtain Token", 1, 0, 0.0, 2419.0, 2419, 2419, 2419.0, 2419.0, 2419.0, 0.41339396444811904, 3.270414556634973, 5.783882156883009], "isController": true}, {"data": ["Change Meter Status from CONFIGURED to UNCLAIMED", 1, 1, 100.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 18.51851851851852, 29.206452546296298, 10.923032407407408], "isController": false}, {"data": ["Get Details of a Role", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 5.434782608695652, 266.3255774456522, 1.3640030570652175], "isController": false}, {"data": ["Add User leco_gm", 1, 1, 100.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 100.0, 50.87890625, 58.3984375], "isController": false}]}, function(index, item){
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
