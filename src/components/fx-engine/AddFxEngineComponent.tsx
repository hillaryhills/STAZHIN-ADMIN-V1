import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Loader from "../ui/loader/Loader";
import Radio from "../form/input/Radio";
import Label from "../form/Label";
import Select from "../form/Select";
import { getFxProviders, getCountries } from "../../redux/app";
import { createFxEngine } from "../../redux/fx-engine";
import Alert from "../ui/alert/Alert";

interface FxEngineFormData {
    source_country: string;
    destination_country: string;
    rate: string;
    promo_rate: string;
    fx_provider: string;
    operation_type: "divide" | "multiply";
    status: boolean
}

interface VolumeRange {
    id: number;
    min: string;
    max: string;
    rate: string;
}

interface FxFee {
    id: number;
    min: string;
    max: string;
    fees: string;
}

interface Option {
    value: string;
    label: string;
}

export default function AddFxEngineComponent() {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ variant: "success" | "error" | "warning" | "info"; title: string; message: string } | null>(null);


    const [formData, setFormData] = useState({
        source_country: "",
        destination_country: "",
        rate: "",
        promo_rate: "",
        fx_provider: "",
        operation_type: "divide",
        status: false
    });

    const { fxProviders, countries } = useSelector((state: RootState) => state.app);

    useEffect(() => {
        if (!fxProviders) {
            dispatch(getFxProviders());
        }
        if (!countries) {
            dispatch(getCountries());
        }
    }, [dispatch, fxProviders, countries]);

    // Safe formatting
    const formattedCountries: Option[] = countries?.map((item) => ({
        value: item.currencyCode,
        label: `${item.country} (${item.currencyCode})`,
    })) || [];

    const formattedFxProviders: Option[] = fxProviders?.map((item) => ({
        value: item.provider_name,
        label: item.provider_name,
    })) || [];

    const [volumeRanges, setVolumeRanges] = useState([
        { id: 1, min: "", max: "", rate: "" }
    ]);

    const [fxFees, setFxFees] = useState([
        { id: 1, min: "", max: "", fees: "" }
    ]);


    const handleInputChange = (field: keyof FxEngineFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addVolumeRange = () => {
        setVolumeRanges(prev => [...prev, { id: Date.now(), min: "", max: "", rate: "" }]);
    };

    const removeVolumeRange = (id: number) => {
        if (volumeRanges.length > 1) {
            setVolumeRanges(prev => prev.filter(item => item.id !== id));
        }
    };

    const updateVolumeRange = (id: number, field: keyof VolumeRange, value: string) => {
        setVolumeRanges(prev =>
            prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const addFxFee = () => {
        setFxFees(prev => [...prev, { id: Date.now(), min: "", max: "", fees: "" }]);
    };

    const removeFxFee = (id: number) => {
        if (fxFees.length > 1) {
            setFxFees(prev => prev.filter(item => item.id !== id));
        }
    };

    const updateFxFee = (id: number, field: keyof FxFee, value: string) => {
        setFxFees(prev =>
            prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const handleSubmit = async () => {
        setAlert(null); // clear old alerts
        setLoading(true);

        const payload = {
            source_country: formData.source_country,
            destination_country: formData.destination_country,
            rate: Number(formData.rate),
            promo_rate: Number(formData.promo_rate),
            operation_type: formData.operation_type,
            fx_provider: formData.fx_provider,
            status: formData.status,

            volume: volumeRanges.map(item => ({
                min: Number(item.min),
                max: Number(item.max),
                rate: Number(item.rate),
            })),

            fx_fees: fxFees.map(item => ({
                min: Number(item.min),
                max: Number(item.max),
                fees: Number(item.fees),
            })),
        };

        try {
            const res = await dispatch(createFxEngine(payload)).unwrap();
            if (res.status) {
                setAlert({
                    variant: "success",
                    title: "FX Engine Created",
                    message: res?.message,
                });
                handleReset();
            } else {
                setAlert({
                    variant: "error",
                    title: "Creation Failed",
                    message: res?.message || "Failed to create FX Engine.",
                });
            }


        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong while saving.";
            setAlert({
                variant: "error",
                title: "Submission Failed",
                message: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };


    const handleReset = () => {
        setFormData({
            source_country: "",
            destination_country: "",
            rate: "",
            promo_rate: "",
            fx_provider: "",
            operation_type: "divide",
            status: false
        });
        setVolumeRanges([{ id: 1, min: "", max: "", rate: "" }]);
        setFxFees([{ id: 1, min: "", max: "", fees: "" }]);
    };

    return (
        <div>
            <PageMeta title="Stazhin Fx Engine" description="" />
            <PageBreadcrumb pageTitle="Fx Engine" />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
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


                <div className="rounded-2xl">
                    <div className="space-y-6">
                        {/* Source Country */}
                        <div>
                            <Label>Source Country</Label>
                            <Select
                                options={formattedCountries}
                                placeholder="Select Source Country"
                                onChange={(value) => handleInputChange("source_country", value)}
                                defaultValue={formData.source_country}
                            />
                        </div>

                        {/* Destination Country */}
                        <div>
                            <Label>Destination Country</Label>
                            <Select
                                options={formattedCountries}
                                placeholder="Select Destination Country"
                                onChange={(value) => handleInputChange("destination_country", value)}
                                defaultValue={formData.destination_country}
                            />
                        </div>

                        {/* Rate and promo_rate */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label>Rate</Label>
                                <Input
                                    type="number"
                                    value={formData.rate}
                                    onChange={(e) => handleInputChange("rate", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>promo_rate</Label>
                                <Input
                                    value={formData.promo_rate}
                                    onChange={(e) => handleInputChange("promo_rate", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* FX Provider */}
                        <div>
                            <Label>FX Provider</Label>
                            <Select
                                options={formattedFxProviders}
                                placeholder="Select Fx provider"
                                onChange={(value) => handleInputChange("fx_provider", value)}
                                defaultValue={formData.fx_provider}
                            />
                        </div>

                        {/* Operation Type */}
                        <div>
                            <Label>Operation Type</Label>
                            <div className="flex gap-6">
                                <Radio
                                    id="divide"
                                    name="operation_type"
                                    value="divide"
                                    checked={formData.operation_type === "divide"}
                                    label="Divide"
                                    onChange={(value) => handleInputChange("operation_type", value)}
                                />
                                <Radio
                                    id="multiply"
                                    name="operation_type"
                                    value="multiply"
                                    checked={formData.operation_type === "multiply"}
                                    label="Multiply"
                                    onChange={(value) => handleInputChange("operation_type", value)}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <Label>Status</Label>
                            <div className="flex gap-6">
                                <Radio
                                    id="active"
                                    name="status"
                                    value="true"
                                    checked={formData.status === true}
                                    label="Active"
                                    onChange={() => handleInputChange("status", true)}
                                />
                                <Radio
                                    id="inactive"
                                    name="status"
                                    value="false"
                                    checked={formData.status === false}
                                    label="Inactive"
                                    onChange={() => handleInputChange("status", false)}
                                />
                            </div>

                        </div>

                        {/* Volume Range */}
                        <div>
                            <Label>Volume Range</Label>
                            <div className="space-y-3">
                                {volumeRanges.map((range) => (
                                    <div key={range.id} className="flex gap-3">
                                        <Input
                                            placeholder="Min"
                                            type="number"
                                            value={range.min}
                                            onChange={(e) => updateVolumeRange(range.id, "min", e.target.value)}
                                            className="flex-1"
                                        />
                                        <Input
                                            placeholder="Max"
                                            type="number"
                                            value={range.max}
                                            onChange={(e) => updateVolumeRange(range.id, "max", e.target.value)}
                                            className="flex-1"
                                        />
                                        <Input
                                            placeholder="Rate"
                                            type="number"
                                            value={range.rate}
                                            onChange={(e) => updateVolumeRange(range.id, "rate", e.target.value)}
                                            className="flex-1"
                                        />
                                        <button
                                            onClick={() => removeVolumeRange(range.id)}
                                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" onClick={addVolumeRange} className="mt-3">
                                + Add Volume
                            </Button>
                        </div>

                        {/* FX Fees */}
                        <div>
                            <Label>FX Fees</Label>
                            <div className="space-y-3">
                                {fxFees.map((fee) => (
                                    <div key={fee.id} className="flex gap-3">
                                        <Input
                                            placeholder="Min"
                                            type="number"
                                            value={fee.min}
                                            onChange={(e) => updateFxFee(fee.id, "min", e.target.value)}
                                            className="flex-1"
                                        />
                                        <Input
                                            placeholder="Max"
                                            type="number"
                                            value={fee.max}
                                            onChange={(e) => updateFxFee(fee.id, "max", e.target.value)}
                                            className="flex-1"
                                        />
                                        <Input
                                            placeholder="Fees"
                                            type="number"
                                            value={fee.fees}
                                            onChange={(e) => updateFxFee(fee.id, "fees", e.target.value)}
                                            className="flex-1"
                                        />
                                        <button
                                            onClick={() => removeFxFee(fee.id)}
                                            className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" onClick={addFxFee} className="mt-3">
                                + Add Fees
                            </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button variant="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}