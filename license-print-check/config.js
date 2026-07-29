/**
 * Unified Driving License Print Check - Transport Offices Configuration
 * Supports 4 distinct status cases across Bagamati Transport Management Offices
 */

const THULOBHARYANG_APIKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidXZ5Y3NsdnZxYWFmd251Z3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTUyNDEsImV4cCI6MjA5NzQ3MTI0MX0.Rl6qprZT6uMfsCX33pXgrM8owe7o6O_zAHjZUw3fixg";
const CHABAHIL_APIKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvYWFqd3h5bXNjdXpkbHV6bXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NzEwNTIsImV4cCI6MjA5MzQ0NzA1Mn0.ZoKAAnku44rN20fUPqYzaLUD9HHU9A02aRD0n4gmh1Y";

function cleanLicNo(s) {
    return (s || '').replace(/[^a-zA-Z0-9]/g, '').trim().toUpperCase();
}

const DEFAULT_OFFICES = [
    {
        id: "ekantakuna",
        name: "TMO Ekantakuna (Lalitpur)",
        nepaliName: "यातायात व्यवस्था कार्यालय (सवारी चालक अनुमतिपत्र) एकान्तकुना, ललितपुर",
        shortName: "Ekantakuna",
        description: "Transport Management Office (Driving License), Ekantakuna, Lalitpur",
        enabled: true,
        method: "GET",
        format: "json",
        urlTemplate: "https://printekantakuna.bagamati.gov.np/api/api/public/{license_number}",
        headers: {},
        bodyTemplate: null,
        address: "Ekantakuna, Ring Road, Lalitpur (एकान्तकुना, ललितपुर)",
        phone: "01-5522114",
        email: "info.tmopl@bagamati.gov.np",
        officialWebsite: "https://tmopl.bagamati.gov.np",
        printCheckPortal: "https://printekantakuna.bagamati.gov.np",
        mapUrl: "https://maps.google.com/?q=Transport+Management+Office+Ekantakuna+Lalitpur",
        additionalSteps: {
            required: true,
            titleNp: "अनलाइन फारम भर्नुपर्ने (Receiver Details Form Required)",
            titleEn: "Receiver Form Registration Required",
            instructionNp: "बुझिलिने व्यक्तिको विवरण भरी देखाइएको स्थानमा RECEIVED-ID र रसिद उपलब्ध गराएपछि मात्र लाइसेन्स बुझ्न सकिन्छ ।",
            instructionEn: "Complete receiver details on official portal. Room number & RECEIVED-ID will be assigned upon submitting form.",
            actionText: "Open TMO Ekantakuna Official Portal (License Pre-copied)",
            actionUrl: "https://printekantakuna.bagamati.gov.np"
        },
        openPortalWithQuery: function (licenseNo) {
            if (navigator.clipboard) navigator.clipboard.writeText(licenseNo);
            window.open("https://printekantakuna.bagamati.gov.np", "_blank");
        },
        parseResponse: function (data, targetLicense) {
            const targetClean = cleanLicNo(targetLicense);
            if (Array.isArray(data) && data.length > 0) {
                const item = data.find(i => cleanLicNo(i.licenseNumber) === targetClean);
                if (item) {
                    const rawStatus = (item.status || "").toLowerCase();
                    const isPending = rawStatus.includes("pending");
                    const isDistributed = rawStatus.includes("distributed");
                    const isPrintedOnly = rawStatus === "printed";

                    // CASE 2: Received but Needs Form Fill (status === 'Printed')
                    // For Case 2 at Ekantakuna, DO NOT show box code or room number!
                    if (isPrintedOnly) {
                        return {
                            found: true,
                            caseType: 2,
                            status: "Printed & Ready (Form Fill Required)",
                            statusNp: "प्रिन्ट भइसकेको (फारम भर्न बाँकी)",
                            statusEn: "Printed & Ready (Receiver Form Fill Required)",
                            isPrinted: true,
                            isCollected: false,
                            requiresFormFill: true,
                            name: item.name ? item.name.trim() : "N/A",
                            licenseNumber: item.licenseNumber || targetLicense,
                            category: item.category || "N/A",
                            printedDate: item.printedDate || "N/A",
                            blockNumber: null,
                            boxCode: null,
                            counterRoom: "लाइसेन्स बुझिलिने व्यक्तिको विवरण भरेपछि कोठा नं. देखाउँछ",
                            sn: null,
                            receivedId: null,
                            instructionNp: `बुझिलिने व्यक्तिको विवरण भरी देखाइएको स्थानमा RECEIVED-ID र रसिद उपलब्ध गराएपछि मात्र लाइसेन्स बुझ्न सकिन्छ ।`,
                            instructionEn: `Complete receiver details on official portal. Room number & RECEIVED-ID will be shown upon submitting form.`,
                            raw: item
                        };
                    }

                    // CASE 3 Distributed (Collected)
                    if (isDistributed) {
                        return {
                            found: true,
                            caseType: 3,
                            status: "Printed & Distributed",
                            statusNp: "लाइसेन्स बुझिसकेको (Distributed)",
                            statusEn: "Printed & Collected (Distributed)",
                            isPrinted: true,
                            isCollected: true,
                            requiresFormFill: false,
                            name: item.name ? item.name.trim() : "N/A",
                            licenseNumber: item.licenseNumber || targetLicense,
                            category: item.category || "N/A",
                            printedDate: item.printedDate || "N/A",
                            blockNumber: item.blocknumber || null,
                            boxCode: null,
                            counterRoom: "Distributed",
                            sn: item.sn || null,
                            receivedId: null,
                            distributedBy: item.distributedBy || "Staff",
                            receivedDate: item.receivedDate || "N/A",
                            receiverName: item.receiverName || "Self",
                            instructionNp: `उक्त लाइसेन्स कार्ड ${item.receivedDate || 'कार्यालयबाट'} मा बुझिसकिएको छ (${item.receiverName || 'Self'} द्वारा प्राप्त)।`,
                            instructionEn: `This license card was collected on ${item.receivedDate || 'office records'} by ${item.receiverName || 'Self'}.`,
                            raw: item
                        };
                    }

                    // CASE 3 Pending Pickup (Form Submitted)
                    const receivedId = item.sn || item.id || "8736";
                    const roomNo = item.roomNo || "208-(ग)";

                    return {
                        found: true,
                        caseType: 3,
                        status: "Pending Counter Pickup",
                        statusNp: "फारम दर्ता भइसकेको (Pending Counter Pickup)",
                        statusEn: "Form Submitted / Pending Counter Pickup",
                        isPrinted: true,
                        isCollected: false,
                        requiresFormFill: false,
                        name: item.name ? item.name.trim() : "N/A",
                        licenseNumber: item.licenseNumber || targetLicense,
                        category: item.category || "N/A",
                        printedDate: item.printedDate || "N/A",
                        blockNumber: item.blocknumber || "E",
                        boxCode: null,
                        counterRoom: `कोठा नं. ${roomNo}`,
                        sn: receivedId,
                        receivedId: receivedId,
                        instructionNp: `एकान्तकुना कोठा नं. ${roomNo} मा सक्कल रसिद र RECEIVED ID = ${receivedId} उपलब्ध गराएपछि मात्र लाइसेन्स बुझ्न सकिन्छ।`,
                        instructionEn: `Present original payment receipt and RECEIVED ID = ${receivedId} at Room No. ${roomNo} to collect your license.`,
                        raw: item
                    };
                }
            }
            return {
                found: false,
                caseType: 1,
                status: "Not Found",
                statusNp: "भेटिएन",
                statusEn: "Not Found",
                isPrinted: false,
                requiresFormFill: false,
                raw: data
            };
        }
    },
    {
        id: "thulobharyang",
        name: "TMO Thulobharyang (Kalanki)",
        nepaliName: "यातायात व्यवस्था कार्यालय (सवारी चालक अनुमतिपत्र) कलंकी/ठूलोभर्याङ, काठमाडौं",
        shortName: "Thulobharyang",
        description: "Transport Management Office (Driving License), Thulobharyang / Kalanki, Kathmandu",
        enabled: true,
        method: "POST",
        format: "json",
        urlTemplate: "https://gbuvycslvvqaafwnugsi.supabase.co/rest/v1/rpc/search_license_public",
        headers: {
            "Content-Type": "application/json",
            "apikey": THULOBHARYANG_APIKEY,
            "authorization": `Bearer ${THULOBHARYANG_APIKEY}`,
            "content-profile": "public",
            "x-client-info": "supabase-js/2.111.0; runtime=web"
        },
        bodyTemplate: JSON.stringify({ search_query: "{license_number}" }),
        address: "Thulobharyang, Kalanki, Kathmandu (कलङ्की/ठूलोभर्याङ, काठमाडौँ)",
        phone: "01-5249118",
        email: "dltmothulo@gmail.com",
        officialWebsite: "https://tmokalanki.bagamati.gov.np",
        printCheckPortal: "https://tmokalanki.bagamati.gov.np/pages/searchList/",
        mapUrl: "https://maps.google.com/?q=Transport+Management+Office+Thulobharyang+Kalanki",
        additionalSteps: {
            required: true,
            titleNp: "अनलाइन फारम भर्नुपर्ने (Pre-Collection Form Required)",
            titleEn: "Online Pre-Collection Form Required",
            instructionNp: "तपाईंले खोजी गर्नुभएको लाइसेन्स कार्यालयमा प्राप्त भई वितरणको निम्ति तयार छ । कार्यालयमा लाइसेन्स लिन आउने व्यक्तिको नाम र फोन नम्बर टाइप गरेर फारम भर्नुहोस् ।",
            instructionEn: "License is received and ready for distribution. Complete the online collection form with collector's name and mobile number on official portal before visiting.",
            actionText: "Open TMO Kalanki Official Portal (License Pre-copied)",
            actionUrl: "https://tmokalanki.bagamati.gov.np/pages/searchList/"
        },
        openPortalWithQuery: function (licenseNo) {
            if (navigator.clipboard) navigator.clipboard.writeText(licenseNo);
            window.open("https://tmokalanki.bagamati.gov.np/pages/searchList/", "_blank");
        },
        parseResponse: function (data, targetLicense) {
            const targetClean = cleanLicNo(targetLicense);
            if (Array.isArray(data) && data.length > 0) {
                const item = data.find(i => cleanLicNo(i.license_number) === targetClean);
                if (item) {
                    const isCollected = item.is_collected === true;
                    const caseType = isCollected ? 3 : 2;
                    const boxCode = item.box_code || "01-G12-023";

                    return {
                        found: true,
                        caseType: caseType,
                        status: isCollected ? "Printed & Collected" : "Printed & Ready (Form Fill Required)",
                        statusNp: isCollected ? "संकलन दर्ता भइसकेको (Printed & Collected)" : "वितरणको निम्ति तयार (फारम भर्न बाँकी)",
                        statusEn: isCollected ? "Printed & Collected" : "Printed & Ready (Pre-Registration Form Required)",
                        isPrinted: true,
                        isCollected: isCollected,
                        requiresFormFill: !isCollected,
                        name: item.holder_name ? item.holder_name.trim() : "N/A",
                        licenseNumber: item.license_number || targetLicense,
                        category: item.category || "N/A",
                        printedDate: item.printed_date || "N/A",
                        blockNumber: boxCode,
                        boxCode: boxCode,
                        counterRoom: `Box Code: ${boxCode}`,
                        sn: item.id ? String(item.id) : "N/A",
                        instructionNp: isCollected
                            ? "यो लाइसेन्स संकलन गर्नको लागि फारम भरिसक्नुभएको देखिन्छ।"
                            : "तपाईंले खोजी गर्नुभएको लाइसेन्स कार्यालयमा प्राप्त भई वितरणको निम्ति तयार छ । कार्यालयमा लाइसेन्स लिन आउने व्यक्तिको नाम र फोन नम्बर टाइप गरेर 'संकलन गर्नुहोस्' बटनमा क्लिक गर्नुहोस् ।",
                        instructionEn: isCollected
                            ? "Pre-collection form has already been submitted for this license."
                            : "License is received and ready for distribution. Complete the online collection form with collector's name and mobile number on official portal before visiting.",
                        raw: item
                    };
                }
            }
            return {
                found: false,
                caseType: 1,
                status: "Not Found",
                statusNp: "भेटिएन",
                statusEn: "Not Found",
                isPrinted: false,
                requiresFormFill: false,
                raw: data
            };
        }
    },
    {
        id: "chabahil",
        name: "TMO Chabahil (Kathmandu)",
        nepaliName: "यातायात व्यवस्था कार्यालय (सवारी चालक अनुमतिपत्र) चाबहिल, काठमाडौं",
        shortName: "Chabahil",
        description: "Transport Management Office (Driving License), Chabahil, Kathmandu",
        enabled: true,
        method: "GET",
        format: "json",
        urlTemplate: "https://foaajwxymscuzdluzmxp.supabase.co/rest/v1/tblLicenseRecords?select=%22license_no%22%2C%22name%22&license_no=eq.{license_number}",
        headers: {
            "accept-profile": "public",
            "apikey": CHABAHIL_APIKEY,
            "authorization": `Bearer ${CHABAHIL_APIKEY}`,
            "x-client-info": "supabase-js/2.111.0; runtime=web"
        },
        bodyTemplate: null,
        address: "Chabahil, Ring Road, Kathmandu (चाबहिल, काठमाडौँ)",
        phone: "01-4470311",
        email: "tmochabahil@bagamati.gov.np",
        officialWebsite: "https://tmochabahil.bagamati.gov.np",
        printCheckPortal: "https://chabahillicense.bagamati.gov.np/pages/find-a-license/",
        mapUrl: "https://maps.google.com/?q=Transport+Management+Office+Chabahil+Kathmandu",
        openPortalWithQuery: function (licenseNo) {
            if (navigator.clipboard) navigator.clipboard.writeText(licenseNo);
            window.open("https://chabahillicense.bagamati.gov.np/pages/find-a-license/", "_blank");
        },
        parseResponse: function (data, targetLicense) {
            const targetClean = cleanLicNo(targetLicense);
            if (Array.isArray(data) && data.length > 0) {
                const item = data.find(i => cleanLicNo(i.license_no) === targetClean);
                if (item) {
                    return {
                        found: true,
                        caseType: 4, // Case 4: Direct Counter Collection
                        status: "Printed & Ready",
                        statusNp: "वितरणका लागि तयारी अवस्थामा रहेको (Printed & Ready)",
                        statusEn: "Printed & Ready for Counter Collection",
                        isPrinted: true,
                        isCollected: false,
                        requiresFormFill: false,
                        name: item.name ? item.name.trim() : "N/A",
                        licenseNumber: item.license_no || targetLicense,
                        category: "N/A",
                        printedDate: "Ready for Collection",
                        blockNumber: "Room 301",
                        boxCode: "Room 301",
                        counterRoom: "वितरण कोठा नं. ३०१ (Room No. 301)",
                        sn: "N/A",
                        instructionNp: "लाइसेन्स नं. राख्दा आफ्नो नाम र लाइसेन्स नं. देखाएमा मात्र कार्यालयको वितरण कोठा नं. ३०१ मा आफ्नो सक्कल रसिद वा पुरानो लाइसेन्स देखाई नयाँ लाइसेन्स लिनका लागि अनुरोध गरिन्छ।",
                        instructionEn: "Visit TMO Chabahil Distribution Room No. 301 with your original payment receipt or old driving license to collect your new license card.",
                        raw: item
                    };
                }
            }
            return {
                found: false,
                caseType: 1,
                status: "Not Found",
                statusNp: "भेटिएन",
                statusEn: "Not Found",
                isPrinted: false,
                requiresFormFill: false,
                raw: data
            };
        }
    },
    {
        id: "radheradhe",
        name: "TMO Radhe Radhe (Bhaktapur)",
        nepaliName: "यातायात व्यवस्था कार्यालय (सवारी चालक अनुमतिपत्र) राधेराधे, भक्तपुर",
        shortName: "Radhe Radhe",
        description: "Transport Management Office (Driving License), Radhe Radhe, Bhaktapur",
        enabled: true,
        method: "GET",
        format: "csv",
        urlTemplate: "https://sanjibsimdotmlicense-portal-iota.vercel.app/licenses.csv",
        headers: {},
        bodyTemplate: null,
        address: "Radhe Radhe, Sallaghari, Bhaktapur (राधेराधे, भक्तपुर)",
        phone: "01-6614138",
        email: "tmobhaktapur@bagamati.gov.np",
        officialWebsite: "https://tmobkt.bagamati.gov.np",
        printCheckPortal: "https://sanjibsimdotmlicense-portal-iota.vercel.app/",
        mapUrl: "https://maps.google.com/?q=Transport+Management+Office+Radhe+Radhe+Bhaktapur",
        openPortalWithQuery: function (licenseNo) {
            if (navigator.clipboard) navigator.clipboard.writeText(licenseNo);
            window.open("https://sanjibsimdotmlicense-portal-iota.vercel.app/", "_blank");
        },
        parseResponse: function (csvText, targetLicense) {
            if (!csvText || typeof csvText !== 'string') {
                return { found: false, caseType: 1, status: "Not Found", statusNp: "भेटिएन", statusEn: "Not Found", isPrinted: false };
            }

            const targetClean = cleanLicNo(targetLicense);
            const lines = csvText.split('\n');

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const commaIdx = line.indexOf(',');
                if (commaIdx === -1) continue;

                const licNoClean = cleanLicNo(line.substring(0, commaIdx));
                if (licNoClean === targetClean) {
                    const name = line.substring(commaIdx + 1).trim() || "N/A";
                    return {
                        found: true,
                        caseType: 4, // Case 4: Direct Counter Collection
                        status: "Printed & Ready",
                        statusNp: "वितरणका लागि तयार रहेको (Printed & Ready)",
                        statusEn: "Printed & Ready for Counter Collection",
                        isPrinted: true,
                        isCollected: false,
                        requiresFormFill: false,
                        name: name,
                        licenseNumber: targetLicense,
                        category: "N/A",
                        printedDate: "Ready for Collection",
                        blockNumber: "Room 1",
                        boxCode: "Room 1",
                        counterRoom: "कोठा नं. १ (Room No. 1)",
                        sn: `Line #${i + 1}`,
                        instructionNp: "तपाईंको लाइसेन्स यातायात व्यवस्था कार्यालय, राधेराधेको कोठा नं. १ मा वितरणका लागि तयार छ। सक्कल रसिद र नागरिकता लिई सम्पर्क गर्नुहोला।",
                        instructionEn: "Your driving license is ready for distribution at TMO Radhe Radhe, Room No. 1. Bring original payment receipt and citizenship certificate.",
                        raw: { line: line, lineNumber: i + 1 }
                    };
                }
            }

            return {
                found: false,
                caseType: 1,
                status: "Not Found",
                statusNp: "भेटिएन",
                statusEn: "Not Found",
                isPrinted: false,
                requiresFormFill: false
            };
        }
    }
];

// Global Official Portals & Useful Links
const OFFICIAL_PORTALS = [
    {
        nameNp: "बागमती प्रदेश सवारी चालक अनुमतिपत्र पोर्टल",
        nameEn: "Bagamati Province Driving License Portal",
        url: "https://dl.bagamati.gov.np",
        descNp: "प्रदेशस्तरीय सवारी चालक अनुमतिपत्र अनलाइन प्रणाली",
        descEn: "Official Provincial License Services, Application & Status Tracking"
    },
    {
        nameNp: "यातायात व्यवस्था विभाग",
        nameEn: "Department of Transport Management (DoTM)",
        url: "https://www.dotm.gov.np",
        descNp: "नेपाल सरकार केन्द्रीय यातायात विभाग",
        descEn: "Central Government Transport Department Official Portal"
    },
    {
        nameNp: "या.व्य.का. एकान्तकुना, ललितपुर",
        nameEn: "TMO Ekantakuna (Lalitpur)",
        url: "https://tmopl.bagamati.gov.np",
        printPortal: "https://printekantakuna.bagamati.gov.np",
        phone: "01-5522114",
        address: "Ekantakuna, Lalitpur",
        descNp: "एकान्तकुना कार्यालय आधिकारिक वेबसाइट",
        descEn: "Transport Management Office Ekantakuna Official Portal"
    },
    {
        nameNp: "या.व्य.का. कलङ्की/ठूलोभर्याङ, काठमाडौँ",
        nameEn: "TMO Thulobharyang (Kalanki)",
        url: "https://tmokalanki.bagamati.gov.np",
        printPortal: "https://tmokalanki.bagamati.gov.np/pages/searchList/",
        phone: "01-5249118",
        address: "Thulobharyang, Kalanki, Kathmandu",
        descNp: "ठूलोभर्याङ कलङ्की कार्यालय आधिकारिक पोर्टल",
        descEn: "Transport Management Office Kalanki / Thulobharyang Portal"
    },
    {
        nameNp: "या.व्य.का. चाबहिल, काठमाडौँ",
        nameEn: "TMO Chabahil (Kathmandu)",
        url: "https://tmochabahil.bagamati.gov.np",
        printPortal: "https://chabahillicense.bagamati.gov.np/pages/find-a-license/",
        phone: "01-4470311",
        address: "Chabahil, Kathmandu",
        descNp: "चाबहिल कार्यालय आधिकारिक पोर्टल",
        descEn: "Transport Management Office Chabahil Official Portal"
    },
    {
        nameNp: "या.व्य.का. राधेराधे, भक्तपुर",
        nameEn: "TMO Radhe Radhe (Bhaktapur)",
        url: "https://tmobkt.bagamati.gov.np",
        printPortal: "https://tmobkt.bagamati.gov.np",
        phone: "01-6614138",
        address: "Radhe Radhe, Bhaktapur",
        descNp: "राधेराधे भक्तपुर कार्यालय आधिकारिक पोर्टल",
        descEn: "Transport Management Office Radhe Radhe Bhaktapur Portal"
    }
];

class OfficeRegistry {
    constructor() {
        this.offices = DEFAULT_OFFICES;
    }

    getEnabledOffices() {
        return this.offices;
    }
}

window.OfficeRegistry = new OfficeRegistry();
window.OFFICIAL_PORTALS = OFFICIAL_PORTALS;
