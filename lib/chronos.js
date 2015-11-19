
import agent  from 'superagent';

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

                            response.push(`# HELP chronos_success_count Total number of chronos jobs completed.`);
                            response.push(`# TYPE chronos_success_count counter`);
                            response.push(`chronos_success_count{job="${job.name}"} ${job.successCount}`);

                            response.push(`# HELP chronos_error_count Total number of chronos errors.`);
                            response.push(`# TYPE chronos_error_count counter`);
                            response.push(`chronos_error_count{job="${job.name}"} ${job.errorCount}`);

                            if (job.successCount > 0) {

                                response.push(`# HELP chronos_last_success Last successful run, ms since epoch timestamp.`);
                                response.push(`# TYPE chronos_last_success gauge`);
                                response.push(`chronos_last_success{job="${job.name}"} ${job.lastSuccess}`);
                            }

                            if (job.errorCount > 0) {

                                response.push(`# HELP chronos_last_error Last error, ms since epoch timestamp.`);
                                response.push(`# TYPE chronos_last_error gauge`);
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
