var BuildTestResult = function(data) {

    var test = {
        'title': data.title,
        'fullTitle': data.title,
        'duration': data._duration,
        'pass': data.state === 'pass',
        'fail': data.state === 'fail',
        'pending': data.state === 'pending',
    };

    return test;
} 

module.exports = BuildTestResult
