# Ananke

Exports statics about your Chronos jobs in a prometheus compatible format.

## Example output

This will be repeated for each job

````
chronos_success_count{job="My Chronos Job"} 1
chronos_error_count{job="My Chronos Job"} 0
chronos_last_success{job="My Chronos Job"} 1445968079816
chronos_last_error{job="My Chronos Job"} 1445938079816
````
