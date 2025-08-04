import { useState } from "react";
import { api } from "~/utils/api"; // tRPC client

export default function CvFormPage() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        skills: "",
        experience: "",
    });
    const [pdf, setPdf] = useState<File | null>(null);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const mutation = api.cv.submit.useMutation({
        onSuccess: (data) => {
            setStatus("Success: " + data.message);
        },
        onError: () => {
            setStatus("Error submitting form");
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setPdf(e.target.files[0]);
        }
    };

    const toBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Strip the prefix: "data:application/pdf;base64,"
                const base64 = result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = reject;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pdf) return alert("Please upload a PDF");
        setIsLoading(true);
        const pdfBase64 = await toBase64(pdf);
        try {
            const data = await mutation.mutateAsync({
                ...form,
                pdfBase64,
            });
            setIsLoading(false);
            setStatus("Success: " + data.message);
        } catch {
            setIsLoading(false);
            setStatus("Error submitting form");
        }
    };

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">CV Submission</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    onChange={handleChange}
                    className="w-full p-2 border"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full p-2 border"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    className="w-full p-2 border"
                />
                <textarea
                    name="skills"
                    placeholder="Skills"
                    onChange={handleChange}
                    className="w-full p-2 border"
                />
                <textarea
                    name="experience"
                    placeholder="Experience"
                    onChange={handleChange}
                    className="w-full p-2 border"
                />
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {isLoading ? "Submitting..." : "Submit"}
                </button>



                {status && <p className="text-sm text-gray-700">{status}</p>}
            </form>
        </div>
    );
}
function useEffect(arg0: () => void, arg1: any[]) {
    throw new Error("Function not implemented.");
}

