import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Loader from "../ui/loader/Loader";
import Label from "../form/Label";
import Alert from "../ui/alert/Alert";
import { createComplianceRecord } from "../../redux/kVBCompliance";
import { IFormData } from "../../redux/kVBCompliance/interface";

export default function AddComplianceComponent() {
    const dispatch = useDispatch<AppDispatch>();

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{
        variant: "success" | "error" | "warning" | "info";
        title: string;
        message: string;
    } | null>(null);

    const [formData, setFormData] = useState<IFormData>({
        accountType: "",
        complianceInfo: {
            accountPurpose: [""],
            fundInCountries: [""],
            fundInCcys: [""],
            expectedFundInVolPerMonth: "",
            fundOutCountries: [""],
            fundOutCcys: [""],
            expectedFundOutVolPerMonth: "",
        },
    });

    // Handle simple fields
    const updateField = (field: keyof IFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    type ArrayFields = 'accountPurpose' | 'fundInCountries' | 'fundInCcys' | 'fundOutCountries' | 'fundOutCcys';


    const arrayFieldLabels: [string, ArrayFields][] = [
        ["Account Purpose", "accountPurpose"],
        ["Fund In Countries", "fundInCountries"],
        ["Fund In Currencies", "fundInCcys"],
        ["Fund Out Countries", "fundOutCountries"],
        ["Fund Out Currencies", "fundOutCcys"],
    ];

    const updateNestedArray = (field: ArrayFields, index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            complianceInfo: {
                ...prev.complianceInfo,
                [field]: prev.complianceInfo[field].map((item, i) => (i === index ? value : item)),
            },
        }));
    };

    const addToArray = (field: ArrayFields) => {
        setFormData((prev) => ({
            ...prev,
            complianceInfo: {
                ...prev.complianceInfo,
                [field]: [...prev.complianceInfo[field], ""],
            },
        }));
    };

    const removeFromArray = (field: ArrayFields, index: number) => {
        setFormData((prev) => ({
            ...prev,
            complianceInfo: {
                ...prev.complianceInfo,
                [field]: prev.complianceInfo[field].filter((_, i) => i !== index),
            },
        }));
    };

    const handleSubmit = async () => {
        setAlert(null);
        setLoading(true);

        try {
            const result = await dispatch(createComplianceRecord(formData)).unwrap();

            setAlert({
                variant: "success",
                title: "Success",
                message: result?.message || "Record created successfully",
            });
        } catch (err: unknown) {
            setAlert({
                variant: "error",
                title: "Submission Failed",
                message:
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while saving.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageMeta title="Add Compliance Record" description="" />
            <PageBreadcrumb pageTitle="KVB Compliance" />

            <div className="min-h-screen rounded-xl border border-gray-200 bg-white p-6 dark:bg-gray-900 dark:border-gray-700">

                {alert && (
                    <Alert
                        variant={alert.variant}
                        title={alert.title}
                        message={alert.message}
                    />
                )}

                {loading && (
                    <div className="mb-4">
                        <Loader />
                    </div>
                )}

                <div className="space-y-6">

                    {/* Account Type */}
                    <div>
                        <Label>Account Type</Label>
                        <Input
                            value={formData.accountType}
                            onChange={(e) => updateField("accountType", e.target.value)}
                            placeholder="kvb-eu, kvb-hk, kvb-vapo..."
                        />
                    </div>



                    {arrayFieldLabels.map(([label, field]) => (
                        <div key={field} className="space-y-2">
                            <Label>{label}</Label>

                            {formData.complianceInfo[field].map((item, index) => (
                                <div key={index} className="flex gap-3">
                                    <Input
                                        value={item}
                                        onChange={(e) => updateNestedArray(field, index, e.target.value)}
                                    />
                                    <Button
                                        variant="primary"
                                        className="h-11 flex w-11 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
                                        onClick={() => removeFromArray(field, index)}
                                    >
                                        X
                                    </Button>
                                </div>
                            ))}

                            <Button variant="outline" onClick={() => addToArray(field)}>
                                + Add {label}
                            </Button>
                        </div>
                    ))}


                    {/* Expected Volumes */}
                    <div>
                        <Label>Expected Fund-In Volume (Per Month)</Label>
                        <Input
                            value={formData.complianceInfo.expectedFundInVolPerMonth}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    complianceInfo: {
                                        ...prev.complianceInfo,
                                        expectedFundInVolPerMonth: e.target.value,
                                    },
                                }))
                            }
                        />
                    </div>

                    <div>
                        <Label>Expected Fund-Out Volume (Per Month)</Label>
                        <Input
                            value={formData.complianceInfo.expectedFundOutVolPerMonth}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    complianceInfo: {
                                        ...prev.complianceInfo,
                                        expectedFundOutVolPerMonth: e.target.value,
                                    },
                                }))
                            }
                        />
                    </div>

                    {/* Submit */}
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}
