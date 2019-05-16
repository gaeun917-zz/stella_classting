let data = {};
let users = {};
let dates = [];


const handleFiles = (files) => {
    const totalFilesCount = files.length;
    let fileCount = 0;

    for (let i = 0; i < files.length; i++) {
        const date = files[i].name.split('.')[0];

        // populate for dateFilter
        dates.push(date);

        Papa.parse(files[i], {
            complete: (results) => {
                results.data.map((col) => {
                    // skip missing data: columns that are not 3
                    if (col.length !== 3) {
                        return;
                    }

                    const user = col[0];
                    const action = col[1];
                    const count = col[2];

                    // check and build keys
                    if (!(date in data)) {
                        data[date] = {};
                    }
                    if (!(user in data[date])) {
                        data[date][user] = {};

                        // populate for filter
                        if (!(user in users)) {
                            users[user] = true
                        }
                    }
                    data[date][user][action] = count;
                });

                // check complete and call preps for graph
                fileCount++;
                if (fileCount === totalFilesCount) {
                    $('.result').addClass("show");
                    $('.uploadMsg').addClass("hide");
                    setupUserFilters();
                    setupDateFilter();
                    prepareGraph();// needs to get filter values

                    // inform user
                    console.log('got all results', data);
                }
            },
            error: (err, file) => {
                console.log('got error', err);
            }
        })
    }
}

const buildLineGraph = (inputData, id) => {
    let data = [];
    let legend = [];

    // click, view, watch
    Object.keys(inputData).map((action, i) => {
        legend.push(action);
        data.push(MG.convert.date(inputData[action], 'date'))
    })

    MG.data_graphic({
        title: `역할 별 통계: ${id}`,
        description: "",
        data: data,
        missing_is_zero: true,
        width: 600,
        height: 250,
        right: 40,
        target: document.getElementById(id + '-graph'),
        x_accessor: 'date',
        y_accessor: 'value',
        legend: legend,
        legend_target: '#' + id + '-legend'
    });
}

const buildBarGraph = (barGraphData) => {
    let avgSumData = [];
    Object.keys(barGraphData).map((action) => {
        let sum = barGraphData[action].reduce((a, v) => {
            return a + v
        });
        let avg = parseInt(sum / barGraphData[action].length);
        avgSumData.push({
            type: 'sum',
            number: sum,
            action: action,
        });
        avgSumData.push({
            type: 'average',
            number: avg,
            action: action,
        });
    });
    MG.data_graphic({
        title: '모든 일자 및 기간 별 합계 및 평균값',
        data: avgSumData,
        chart_type: 'bar',
        y_accessor: 'number',
        y_extended_ticks: true,
        x_accessor: 'type',
        xgroup_accessor: 'action',
        height: 250,
        width: 600,
        target: '#sumAndAvgBarGraph'
    });
}

const prepareGraph = () => {
    // reset graphs
    Object.keys(users).map((user) => {
        $('#' + user + '-graph')
    })

    const userFilterValue = $('#user-filter').val();
    const dateStartFilterValue = parseInt($('#date-startFilter').val());
    const dateEndFilterValue = parseInt($('#date-endFilter').val());

    let lineGraphData = {};
    let barGraphData = {};
    const dates = Object.keys(data).sort();

    dates.map((date) => {
        if (parseInt(date) < dateStartFilterValue || parseInt(date) > dateEndFilterValue) {
            return;
        }

        //user filter
        const parsedDate = moment(date).format('YYYY-MM-DD');
        const users = Object.keys(data[date]);
        users.map((user) => {
            // filter user
            if (userFilterValue.length > 0 && !(userFilterValue.includes(user))) {
                if (!(userFilterValue.includes('All'))) {
                    return
                }
            }

            // ensure hash exists
            if (!(user in lineGraphData)) {
                lineGraphData[user] = {}
            }

            const actions = Object.keys(data[date][user]);
            actions.map((action) => {
                const count = parseInt(data[date][user][action])

                if (!(action in lineGraphData[user])) {
                    lineGraphData[user][action] = [];
                }
                lineGraphData[user][action].push({
                    date: parsedDate,
                    value: count
                })

                if (!(action in barGraphData)) {
                    barGraphData[action] = []
                }
                barGraphData[action].push(count)
            })
        })
    });
    console.log('totals', barGraphData);

    buildBarGraph(barGraphData);
    let graphWrapper = $('#userGraphs')
        graphWrapper.empty();
    Object.keys(lineGraphData).map((user) => {
        // setup element
        graphWrapper.append($('<div></div>').attr('id', user + '-graph'))
        graphWrapper.append($('<div></div>').attr('id', user + '-legend'))
        buildLineGraph(lineGraphData[user], user);
    })

}

const setupUserFilters = () => {
    const userFilter = $('#user-filter');
    const dateStartFilter = $('#date-startFilter');

    Object.keys(users).map((user) => {
        userFilter.append($('<option></option>').attr('value', user).text(user))
    })
    userFilter.append($('<option></option>').attr('value', 'All').text("all"))
}

const setupDateFilter = () => {
    const dateEndFilter = $('#date-endFilter');
    const dateStartFilter = $('#date-startFilter');
    const dateStartFilterValue = parseInt(dateStartFilter.val());

    dateEndFilter.empty()
    dates = dates.sort();

    dates.map((date, i) => {
        const selectedOptionItem = $('<option selected></option>').attr('value', date).text(date);
        const optionItem = $('<option></option>').attr('value', date).text(date);

        if (parseInt(date) <= dateStartFilterValue) {
            return;
        }

        if (i === 0) {
            dateStartFilter.append(selectedOptionItem);
            return;
        }
        dateStartFilter.append(optionItem);

        if (i === dates.length - 1) {
            dateEndFilter.append(selectedOptionItem);
            return;
        }
        dateEndFilter.append(optionItem)
    });
}
