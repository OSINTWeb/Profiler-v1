import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { CheckSquare, FileText, FileSpreadsheet, FileJson, FileEdit, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlatformData {
  module: string;
  pretty_name?: string;
  pretty_data?: Record<string, unknown>;
  query: string;
  status: string;
  from: string;
  reliable_source: boolean;
  data?: {
    phone_number?: string;
    qq_id?: string;
    email?: string;
    region?: string;
    league_of_legends_id?: string;
    weibo_link?: string;
    weibo_id?: string;
    profile_pic?: string;
    first_name?: string;
    last_name?: string;
    user?: string;
    avatar?: string;
    active?: boolean;
    private?: boolean;
    objectID?: string;
    friends_with?: unknown[];
    [key: string]: unknown;
  };
  category: {
    name: string;
    description: string;
  };
  spec_format: {
    registered?: { value: boolean };
    breach?: { value: boolean };
    name?: { value: string };
    picture_url?: { value: string };
    website?: { value: string };
    id?: { value: string };
    bio?: { value: string };
    creation_date?: { value: string };
    gender?: { value: string };
    last_seen?: { value: string };
    username?: { value: string };
    location?: { value: string };
    phone_number?: { value: string };
    phone?: { value: string };
    email?: { value: string };
    birthday?: { value: string };
    language?: { value: string };
    age?: { value: number };
    platform_variables?: Array<{
      key: string;
      proper_key?: string;
      value: string;
      type?: string;
    }>;
  }[];
  front_schemas?: {
    module?: string;
    image?: string;
    body?: Record<string, unknown>;
    tags?: Array<{
      tag: string;
      url?: string;
    }>;
  }[];
}

interface ActionBarProps {
  data: PlatformData[];
  selectedData?: PlatformData[];
  hidebutton: boolean;
  sethidebutton: (hidebutton: boolean) => void;
  setenableselect: (enableselect: boolean) => void;
  enableselect: boolean;
  resultCount: number;
  selectedCount?: number;
  exportMode?: "selected" | "excluding_deleted" | "all";
  exportCount?: number;
}

type ExportType = "pdf" | "pdf-plus" | "csv" | "docx" | "json";

export const ActionBar: React.FC<ActionBarProps> = ({
  data,
  selectedData,
  hidebutton,
  resultCount,
  selectedCount = 0,
  exportMode = "all",
  exportCount = 0,
}) => {
  // Use selectedData if available, otherwise use all data
  const dataToExport = selectedData && selectedData.length > 0 ? selectedData : data;

  const flattenData = (item: PlatformData) => {
    const baseFields: Record<string, unknown> = {
      Module: item.module,
      "Pretty Name": item.front_schemas?.[0]?.module || item.pretty_name || item.module,
      Query: item.query,
      Category: item.category?.name,
      "Category Description": item.category?.description,
      Status: item.status,
      "Reliable Source": item.reliable_source ? "Yes" : "No",
      Source: item.from,
      "Profile Image": item.front_schemas?.[0]?.image,
    };

    // Add data fields if they exist
    if (item.data) {
      Object.entries(item.data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          baseFields[formattedKey] =
            typeof value === "boolean"
              ? value
                ? "Yes"
                : "No"
              : Array.isArray(value)
              ? value.length.toString()
              : String(value);
        }
      });
    }

    // Add front_schemas body data if it exists
    if (item.front_schemas?.[0]?.body) {
      Object.entries(item.front_schemas[0].body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          baseFields[key] = String(value);
        }
      });
    }

    const specFields: Record<string, unknown> = item.spec_format?.[0]
      ? {
          Registered: item.spec_format[0].registered?.value ? "Yes" : "No",
          Breached: item.spec_format[0].breach?.value ? "Yes" : "No",
          Name: item.spec_format[0].name?.value,
          Website: item.spec_format[0].website?.value,
          ID: item.spec_format[0].id?.value,
          Bio: item.spec_format[0].bio?.value,
          "Creation Date": item.spec_format[0].creation_date?.value,
          Gender: item.spec_format[0].gender?.value,
          "Last Seen": item.spec_format[0].last_seen?.value,
          Username: item.spec_format[0].username?.value,
          Location: item.spec_format[0].location?.value,
          "Phone Number":
            item.spec_format[0].phone_number?.value || item.spec_format[0].phone?.value,
          Email: item.spec_format[0].email?.value,
          Birthday: item.spec_format[0].birthday?.value,
          Language: item.spec_format[0].language?.value,
          Age: item.spec_format[0].age?.value,
          ...(item.spec_format[0].platform_variables?.reduce((acc, variable) => {
            const key =
              variable.proper_key ||
              variable.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            acc[key] = variable.value;
            return acc;
          }, {} as Record<string, string>) || {}),
        }
      : {};

    return { ...baseFields, ...specFields };
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF();

      // Set up fonts and styling
      doc.setFont("helvetica", "normal");

      // Add title
      doc.setFontSize(24);
      doc.text("Platform Data Report", 105, 20, { align: "center" });

      // Add generation date and selection info
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 30, { align: "center" });
      if (selectedData && selectedData.length > 0) {
        doc.text(`Selected Records: ${selectedData.length} of ${resultCount}`, 105, 40, { align: "center" });
      }

      let yPos = 50;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;

      // Helper function to add image
      const addImage = async (imageUrl: string, y: number) => {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          return new Promise<number>((resolve) => {
            const reader = new FileReader();
            reader.onload = function (event) {
              if (event.target?.result) {
                const imgData = event.target.result as string;
                // Add image with 40x40 dimensions
                const imgWidth = 40;
                const imgHeight = 40;
                const xPos = margin;
                doc.addImage(imgData, "JPEG", xPos, y, imgWidth, imgHeight);
                resolve(imgHeight + 5); // Return height + padding
              } else {
                resolve(0);
              }
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error loading image:", error);
          return 0;
        }
      };

      // Process each record
      for (const item of dataToExport) {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        // Record header with background
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(item.module || "Unknown Platform", margin + 2, yPos + 7);
        yPos += 15;

        // Add profile image if available
        const imageUrl =
          item.spec_format?.[0]?.picture_url?.value || item.front_schemas?.[0]?.image;

        if (imageUrl) {
          const imageHeight = await addImage(imageUrl, yPos);
          yPos += imageHeight;
        }

        // Basic Information Section
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Basic Information", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");

        const addField = (label: string, value: unknown) => {
          if (value !== undefined && value !== null && typeof value !== "object") {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, margin, yPos);
            doc.setFont("helvetica", "normal");
            const valueStr = String(value);
            // Handle long text with word wrap
            const splitText = doc.splitTextToSize(valueStr, pageWidth - 2 * margin - 40);
            doc.text(splitText, margin + 40, yPos);
            yPos += splitText.length * 7;
          }
        };

        // Add basic fields
        addField("Module", item.module);
        addField("Query", item.query);
        addField("Category", item.category?.name);
        addField("Status", item.status);
        addField("Source", item.from);
        addField("Reliable Source", item.reliable_source ? "Yes" : "No");

        // Add all data fields
        if (item.data) {
          Object.entries(item.data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
              const formattedValue =
                typeof value === "boolean"
                  ? value
                    ? "Yes"
                    : "No"
                  : Array.isArray(value)
                  ? `${value.length} items`
                  : String(value);
              addField(formattedKey, formattedValue);
            }
          });
        }

        // Add front_schemas body data
        if (item.front_schemas?.[0]?.body) {
          Object.entries(item.front_schemas[0].body).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              addField(key, String(value));
            }
          });
        }

        // Account Status Section
        if (item.spec_format?.[0]) {
          yPos += 5;
          doc.setFont("helvetica", "bold");
          doc.text("Account Status", margin, yPos);
          yPos += 7;

          const spec = item.spec_format[0];
          if (spec.registered?.value !== undefined) {
            addField("Registered", spec.registered.value ? "Yes" : "No");
          }
          if (spec.breach?.value !== undefined) {
            addField("Breached", spec.breach.value ? "Yes" : "No");
          }
        }

        // Personal Information Section
        if (item.spec_format?.[0]) {
          const spec = item.spec_format[0];
          const personalInfo = {
            Name: spec.name?.value,
            Username: spec.username?.value,
            ID: spec.id?.value,
            Bio: spec.bio?.value,
            Website: spec.website?.value,
            Location: spec.location?.value,
            "Phone Number": spec.phone_number?.value,
            Gender: spec.gender?.value,
            Age: spec.age?.value,
            Language: spec.language?.value,
          };

          const hasPersonalInfo = Object.values(personalInfo).some((v) => v !== undefined);

          if (hasPersonalInfo) {
            yPos += 5;
            doc.setFont("helvetica", "bold");
            doc.text("Personal Information", margin, yPos);
            yPos += 7;

            Object.entries(personalInfo).forEach(([key, value]) => {
              if (value !== undefined) {
                addField(key, value);
              }
            });
          }
        }

        // Dates Section
        if (item.spec_format?.[0]) {
          const spec = item.spec_format[0];
          const dates = {
            "Creation Date": spec.creation_date?.value,
            "Last Seen": spec.last_seen?.value,
            Birthday: spec.birthday?.value,
          };

          const hasDates = Object.values(dates).some((v) => v !== undefined);

          if (hasDates) {
            yPos += 5;
            doc.setFont("helvetica", "bold");
            doc.text("Dates", margin, yPos);
            yPos += 7;

            Object.entries(dates).forEach(([key, value]) => {
              if (value !== undefined) {
                addField(key, value);
              }
            });
          }
        }

        // Add separator
        yPos += 10;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 15;
      }

      // Save the PDF
      const filename = selectedData && selectedData.length > 0 
        ? `selected_platform_data_${selectedData.length}_records.pdf`
        : "platform_data.pdf";
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const exportToCSV = () => {
    try {
      // Get all possible keys from all records
      const allKeys = new Set<string>();
      const flattenedData = dataToExport.map((item) => {
        const flattened = flattenData(item);
        Object.keys(flattened).forEach((key) => allKeys.add(key));
        return flattened;
      });

      const headers = Array.from(allKeys);

      // Create CSV content with proper escaping
      const csvRows = flattenedData.map((flattened) => {
        return headers.map((header) => {
          const value = flattened[header as keyof typeof flattened];
          if (value === undefined || value === null) {
            return "";
          }

          const stringValue = String(value);
          // Escape double quotes and wrap in quotes if contains comma, newline, or quote
          if (
            stringValue.includes(",") ||
            stringValue.includes("\n") ||
            stringValue.includes('"')
          ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
      });

      const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const filename = selectedData && selectedData.length > 0 
        ? `selected_platform_data_${selectedData.length}_records.csv`
        : "platform_data.csv";
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error generating CSV:", error);
    }
  };

  const exportToJSON = () => {
    try {
      const exportData = dataToExport;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const filename = selectedData && selectedData.length > 0 
        ? `selected_platform_data_${selectedData.length}_records.json`
        : "platform_data.json";
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error generating JSON:", error);
    }
  };

  const exportToPDFWithImages = async () => {
    try {
      const doc = new jsPDF();

      // Set up fonts and styling
      doc.setFont("helvetica", "normal");

      // Add title
      doc.setFontSize(24);
      doc.text("Platform Data Report with Images", 105, 20, { align: "center" });

      // Add generation date and selection info
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 30, { align: "center" });
      if (selectedData && selectedData.length > 0) {
        doc.text(`Selected Records: ${selectedData.length} of ${resultCount}`, 105, 40, { align: "center" });
      }

      let yPos = selectedData && selectedData.length > 0 ? 60 : 50;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;

      // Enhanced image handling function
      const addImageEnhanced = async (imageUrl: string, y: number) => {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          return new Promise<number>((resolve) => {
            const reader = new FileReader();
            reader.onload = function (event) {
              if (event.target?.result) {
                const imgData = event.target.result as string;
                // Add larger image with better quality
                const imgWidth = 60;
                const imgHeight = 60;
                const xPos = margin;
                doc.addImage(imgData, "JPEG", xPos, y, imgWidth, imgHeight);
                resolve(imgHeight + 10); // Return height + padding
              } else {
                resolve(0);
              }
            };
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error loading image:", error);
          return 0;
        }
      };

      // Process each record with enhanced image display
      for (const item of dataToExport) {
        // Check if we need a new page
        if (yPos > 230) {
          doc.addPage();
          yPos = 20;
        }

        // Record header with background
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 10, "F");
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(item.module || "Unknown Platform", margin + 2, yPos + 7);
        yPos += 15;

        // Add profile images with enhanced display
        const imageUrl =
          item.spec_format?.[0]?.picture_url?.value || item.front_schemas?.[0]?.image;

        if (imageUrl) {
          const imageHeight = await addImageEnhanced(imageUrl, yPos);
          yPos += imageHeight;
        }

        // Add all available images from data
        if (item.data?.profile_pic) {
          const imageHeight = await addImageEnhanced(item.data.profile_pic as string, yPos);
          yPos += imageHeight;
        }

        // Basic Information Section
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Basic Information", margin, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");

        const addField = (label: string, value: unknown) => {
          if (value !== undefined && value !== null && typeof value !== "object") {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.setFont("helvetica", "bold");
            doc.text(`${label}:`, margin, yPos);
            doc.setFont("helvetica", "normal");
            const valueStr = String(value);
            // Handle long text with word wrap
            const splitText = doc.splitTextToSize(valueStr, pageWidth - 2 * margin - 40);
            doc.text(splitText, margin + 40, yPos);
            yPos += splitText.length * 7;
          }
        };

        // Add basic fields
        addField("Module", item.module);
        addField("Pretty Name", item.front_schemas?.[0]?.module || item.pretty_name || item.module);
        addField("Query", item.query);
        addField("Category", item.category?.name);
        addField("Category Description", item.category?.description);
        addField("Status", item.status);
        addField("Source", item.from);
        addField("Reliable Source", item.reliable_source ? "Yes" : "No");

        // Add all data fields
        if (item.data) {
          Object.entries(item.data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
              const formattedValue =
                typeof value === "boolean"
                  ? value
                    ? "Yes"
                    : "No"
                  : Array.isArray(value)
                  ? `${value.length} items`
                  : String(value);
              addField(formattedKey, formattedValue);
            }
          });
        }

        // Add front_schemas body data
        if (item.front_schemas?.[0]?.body) {
          Object.entries(item.front_schemas[0].body).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              addField(key, String(value));
            }
          });
        }

        // Account Status Section
        if (item.spec_format?.[0]) {
          yPos += 5;
          doc.setFont("helvetica", "bold");
          doc.text("Account Status", margin, yPos);
          yPos += 7;

          const spec = item.spec_format[0];
          if (spec.registered?.value !== undefined) {
            addField("Registered", spec.registered.value ? "Yes" : "No");
          }
          if (spec.breach?.value !== undefined) {
            addField("Breached", spec.breach.value ? "Yes" : "No");
          }
        }

        // Personal Information Section
        if (item.spec_format?.[0]) {
          const spec = item.spec_format[0];
          const personalInfo = {
            Name: spec.name?.value,
            Username: spec.username?.value,
            ID: spec.id?.value,
            Bio: spec.bio?.value,
            Website: spec.website?.value,
            Location: spec.location?.value,
            "Phone Number": spec.phone_number?.value || spec.phone?.value,
            Email: spec.email?.value,
            Gender: spec.gender?.value,
            Age: spec.age?.value,
            Language: spec.language?.value,
          };

          const hasPersonalInfo = Object.values(personalInfo).some((v) => v !== undefined);

          if (hasPersonalInfo) {
            yPos += 5;
            doc.setFont("helvetica", "bold");
            doc.text("Personal Information", margin, yPos);
            yPos += 7;

            Object.entries(personalInfo).forEach(([key, value]) => {
              if (value !== undefined) {
                addField(key, value);
              }
            });
          }
        }

        // Dates Section
        if (item.spec_format?.[0]) {
          const spec = item.spec_format[0];
          const dates = {
            "Creation Date": spec.creation_date?.value,
            "Last Seen": spec.last_seen?.value,
            Birthday: spec.birthday?.value,
          };

          const hasDates = Object.values(dates).some((v) => v !== undefined);

          if (hasDates) {
            yPos += 5;
            doc.setFont("helvetica", "bold");
            doc.text("Dates", margin, yPos);
            yPos += 7;

            Object.entries(dates).forEach(([key, value]) => {
              if (value !== undefined) {
                addField(key, value);
              }
            });
          }
        }

        // Platform Variables Section
        if (item.spec_format?.[0]?.platform_variables?.length) {
          yPos += 5;
          doc.setFont("helvetica", "bold");
          doc.text("Platform Variables", margin, yPos);
          yPos += 7;

          item.spec_format[0].platform_variables.forEach((variable) => {
            const key = variable.proper_key || 
              variable.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            addField(key, variable.value);
          });
        }

        // Tags Section
        if (item.front_schemas?.[0]?.tags?.length) {
          yPos += 5;
          doc.setFont("helvetica", "bold");
          doc.text("Tags", margin, yPos);
          yPos += 7;

          item.front_schemas[0].tags.forEach((tag, index) => {
            addField(`Tag ${index + 1}`, tag.tag);
            if (tag.url) {
              addField(`Tag ${index + 1} URL`, tag.url);
            }
          });
        }

        // Add separator
        yPos += 10;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 15;
      }

      // Save the PDF
      const filename = selectedData && selectedData.length > 0 
        ? `selected_platform_data_with_images_${selectedData.length}_records.pdf`
        : "platform_data_with_images.pdf";
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF with images:", error);
    }
  };

  const exportToDOCX = async () => {
    try {
      // Create document with title and timestamp
      const sections = [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Platform Data Report",
              heading: HeadingLevel.TITLE,
              spacing: { before: 240, after: 240 },
            }),
            new Paragraph({
              text: `Generated on ${new Date().toLocaleString()}`,
              heading: HeadingLevel.HEADING_4,
              spacing: { before: 240, after: 120 },
            }),
          ],
        },
      ];

      if (selectedData && selectedData.length > 0) {
        sections[0].children.push(
          new Paragraph({
            text: `Selected Records: ${selectedData.length} of ${resultCount}`,
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 120, after: 480 },
          })
        );
      }

      // Process each record and add to the main section
      dataToExport.forEach((item, index) => {
        const recordData = flattenData(item);

        // Helper function to add field paragraphs
        const addField = (label: string, value: string | undefined) => {
          if (value && typeof value === 'string') {
            sections[0].children.push(
              new Paragraph({
                children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun(value)],
                spacing: { after: 120 },
              })
            );
          }
        };

        // Helper function to add section header
        const addSectionHeader = (title: string) => {
          sections[0].children.push(
            new Paragraph({
              text: title,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 240, after: 120 },
            })
          );
        };

        // Record header
        sections[0].children.push(
          new Paragraph({
            text: `Record ${index + 1}: ${recordData["Pretty Name"]}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
          })
        );

        // Basic Information
        addSectionHeader("Basic Information");
        addField("Module", String(recordData["Module"]));
        addField("Pretty Name", String(recordData["Pretty Name"]));
        addField("Query", String(recordData["Query"]));
        addField("Category", String(recordData["Category"]));
        addField("Category Description", String(recordData["Category Description"]));
        addField("Status", String(recordData["Status"]));
        addField("Reliable Source", String(recordData["Reliable Source"]));
        addField("Source", String(recordData["Source"]));
        addField("Profile Image", String(recordData["Profile Image"]));
        addField("Registered", String(recordData["Registered"]));
        addField("Breached", String(recordData["Breached"]));
        addField("Name", String(recordData["Name"]));
        addField("Website", String(recordData["Website"]));
        addField("ID", String(recordData["ID"]));
        addField("Bio", String(recordData["Bio"]));
        addField("Creation Date", String(recordData["Creation Date"]));
        addField("Gender", String(recordData["Gender"]));
        addField("Last Seen", String(recordData["Last Seen"]));
        addField("Username", String(recordData["Username"]));
        addField("Location", String(recordData["Location"]));
        addField("Phone Number", String(recordData["Phone Number"]));
        addField("Email", String(recordData["Email"]));
        addField("Birthday", String(recordData["Birthday"]));
        addField("Language", String(recordData["Language"]));
        addField("Age", String(recordData["Age"]));
        
        // Account Status
        if (recordData["Registered"] || recordData["Breached"]) {
          addSectionHeader("Account Status");
          addField("Registered", String(recordData["Registered"]));
          addField("Breached", String(recordData["Breached"]));
        }

        // Personal Information
        const personalInfo = {
          Name: recordData["Name"],
          Username: recordData["Username"],
          ID: recordData["ID"],
          Bio: recordData["Bio"],
          Website: recordData["Website"],
          Location: recordData["Location"],
          "Phone Number": recordData["Phone Number"],
          Gender: recordData["Gender"],
          Age: recordData["Age"],
          Language: recordData["Language"],
        };

        if (Object.values(personalInfo).some(Boolean)) {
          addSectionHeader("Personal Information");
          Object.entries(personalInfo).forEach(([key, value]) => addField(key, String(value)));
        }

        // Dates
        const dates = {
          "Creation Date": recordData["Creation Date"],
          "Last Seen": recordData["Last Seen"],
          Birthday: recordData["Birthday"],
        };

        if (Object.values(dates).some(Boolean)) {
          addSectionHeader("Dates");
          Object.entries(dates).forEach(([key, value]) => addField(key, String(value)));
        }

        // Add separator
        sections[0].children.push(
          new Paragraph({
            text: "",
            spacing: { after: 480 },
            border: {
              bottom: { style: "single", size: 6, color: "999999" },
            },
          })
        );
      });

      const doc = new Document({
        sections: sections,
      });

      // Generate and save the document
      const blob = await Packer.toBlob(doc);
      const filename = selectedData && selectedData.length > 0 
        ? `selected_platform_data_${selectedData.length}_records.docx`
        : "platform_data.docx";
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error generating DOCX:", error);
    }
  };
  
  const handleExport = (type: ExportType) => {
    switch (type) {
      case "pdf":
        exportToPDFWithImages();
        break;
      case "csv":
        exportToCSV();
        break;
      case "docx":
        exportToDOCX();
        break;
      case "json":
        exportToJSON();
        break;
    }
  };

  const getTooltipText = () => {
    if (exportMode === "selected" && selectedCount > 0) {
      return `Export ${selectedCount} selected records only`;
    } else if (exportMode === "excluding_deleted" && exportCount > 0) {
      return `Export ${exportCount} records (excluding deleted ones)`;
    } else {
      return "Export all records. Use select mode to export specific records, or delete mode to exclude unwanted records.";
    }
  };

  return (
    <div className="flex w-full max-w-full items-stretch gap-5 font-medium text-center flex-wrap justify-between px-2 max-md:max-w-full mb-4">
      <div className="bg-gradient-to-br from-[#0f0f12] to-[#14141f] border flex w-full items-stretch gap-5 text-xl text-[rgba(84,143,155,1)] font-medium text-center leading-none flex-wrap justify-between px-[35px] py-[34px] rounded-lg border-[rgba(51,53,54,1)] border-solid max-md:max-w-full max-md:mr-2.5 max-md:px-5">
        <div className="flex gap-[9px] items-center justify-center max-md:text-lg">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/08f1489d1012429aa8532f7dba7fd4a0/e03434cdb0512efa4dac167482ef1507f4ba547658fc4e584099d26d4362fd4a?placeholderIfAbsent=true"
            className="aspect-[1] object-contain w-[22px] shrink-0"
            alt="Results icon"
          />
          <div>{resultCount} Results</div>
          {exportMode === "selected" && selectedCount > 0 && (
            <div className="text-[rgba(84,143,155,1)] text-sm">
              • {selectedCount} Selected for Export
            </div>
          )}
          {exportMode === "excluding_deleted" && exportCount > 0 && exportCount < resultCount && (
            <div className="text-orange-400 text-sm">
              • {exportCount} for Export ({resultCount - exportCount} excluded)
            </div>
          )}
        </div>

        <div className="flex items-stretch gap-[13px] text-sm text-[rgba(207,207,207,1)] max-md:flex-wrap max-md:justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] justify-center items-center max-md:flex-1 max-md:min-w-[120px] ${
                    hidebutton ? "shadow-lg shadow-[rgba(84,143,155,0.5)]" : ""
                  }`}
                  aria-label="Export PDF"
                  onClick={() => handleExport("pdf")}
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipText()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] justify-center items-center max-md:flex-1 max-md:min-w-[120px] ${
                    hidebutton ? "shadow-lg shadow-[rgba(84,143,155,0.5)]" : ""
                  }`}
                  aria-label="Export CSV"
                  onClick={() => handleExport("csv")}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>CSV</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipText()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] justify-center items-center max-md:flex-1 max-md:min-w-[120px] ${
                    hidebutton ? "shadow-lg shadow-[rgba(84,143,155,0.5)]" : ""
                  }`}
                  aria-label="Export DOC"
                  onClick={() => handleExport("docx")}
                >
                  <FileEdit className="w-4 h-4" />
                  <span>DOC</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipText()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={`flex bg-[rgba(19,19,21,1)] gap-1 border whitespace-nowrap px-4 py-2.5 rounded-lg border-[#163941] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[rgba(84,143,155,0.5)] justify-center items-center max-md:flex-1 max-md:min-w-[120px] ${
                    hidebutton ? "shadow-lg shadow-[rgba(84,143,155,0.5)]" : ""
                  }`}
                  aria-label="Export JSON"
                  onClick={() => handleExport("json")}
                >
                  <FileJson className="w-4 h-4" />
                  <span>JSON</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltipText()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
