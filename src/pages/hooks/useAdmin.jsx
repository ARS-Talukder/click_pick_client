import { useEffect, useState } from "react"

const useAdmin = user => {
    const [admin, setAdmin] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);
    useEffect(() => {
        const email = user?.email;
        if (!email) {
            setAdmin(false);
            setAdminLoading(false);
            return;
        }
        if (email) {
            fetch(`http://localhost:5000/admin/${email}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setAdmin(data.admin);
                })
                .catch(err => {
                    console.error(err);
                    setAdmin(false);
                })
                .finally(() => {
                    setAdminLoading(false);
                });
        }
    }, [user])

    return [admin, adminLoading]
}

export default useAdmin;