
jobs = [
    {
        "id": 1,
        "task": "Generate report",
        "status": "pending",
        "attempts": 0
    },
    {
        "id": 2,
        "task": "Send email",
        "status": "pending",
        "attempts": 0
    },
    {
        "id": 3,
        "task": "Data backup",
        "status": "failed",
        "attempts": 0
    }
]

def get_next_pending_job(jobs):
    for job in jobs:
        if job["status"] == "pending":
            return job
    return None



def process_next_job(jobs):
    job = get_next_pending_job(jobs)


    if job is None: 
        return "No pending jobs"
    job["status"] = "completed"

    return f"Job {job['id']} is now {job['status']}"
    
    


def process_job(jobs, job_id, success):
    for job in jobs:
        
        if job["id"] == job_id:
            if job['status'] == 'completed' or  job['attempts'] >= 3:
                return "Job cannot be processed"
            job['attempts'] += 1
            
            if success:
                job["status"] = "completed"
            else:
                job["status"] = "failed"

            return f"Job {job_id} is now {job['status']} (attempt {job['attempts']})"

    return "Job not found"



   
   
def get_all_jobs(jobs):
    return jobs


def get_completed_jobs(jobs, status):
    job_status = []
    for job in jobs:
        if job['status'] == status:
            job_status.append(job)
    return job_status
        
print(get_completed_jobs(jobs, "pending"))



