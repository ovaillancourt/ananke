
import agent  from 'superagent';

//successCount: 1,
//errorCount: 0,
//lastSuccess: "2015-10-27T03:12:52.505Z",
//lastError: "",
//
export default class Chronos {

    constructor(uri) {
        this.uri = uri;
    }

    getMetrics() {

        return new Promise((resolve, reject) => {

            agent
                .get(this.uri + '/scheduler/jobs')
                .end((err, res) => {

                    if (err) {

                        return reject(err);
                    }

                    let jobs = res
                        .body
                        .filter( job => !job.disabled)
                        .map( (job) => {

                            return {
                                name: job.name,
                                lastSuccess: new Date(job.lastSuccess).getTime(),
                                successCount: job.successCount,
                                errorCount: job.errorCount,
                                lastError: new Date(job.lastError).getTime()
                            };
                        })
                        .map( (job) => {

                            let response = [];

                            response.push(`chronos_success_count{job="${job.name}"} ${job.successCount}`);
                            response.push(`chronos_error_count{job="${job.name}"} ${job.errorCount}`);

                            if (job.successCount > 0) {

                                response.push(`chronos_last_success{job="${job.name}"} ${job.lastSuccess}`);
                            }

                            if (job.errorCount > 0) {

                                response.push(`chronos_last_error{job="${job.name}"} ${job.lastError}`);
                            }

                            return response.join('\n');
                        })
                        .join('\n\n');

                    resolve(jobs);
                });
        });
    }
}
