// utils/ticketGenerator.ts
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { TicketRegistrationDataType } from "@/types";
import JsBarcode from "jsbarcode";
import { GeneralDictionary } from "@/types/generalDictionary";
import { Share } from "@/types/share";

// Define TypeScript interfaces for the booking data
interface City {
  name: string;
}

interface Station {
  name: string;
}

interface Bus {
  name: string;
  bus_number: string;
}

interface Route {
  origin_city: City;
  destination_city: City;
  origin_station: Station;
  destination_station: Station;
}

interface Trip {
  route: Route;
  bus: Bus;
  departure_time: string;
  arrival_time: string;
}

interface User {
  first_name: string;
  last_name: string;
}

interface Passenger {
  first_name: string;
}

interface Ticket {
  seat_number: number;
  passenger: Passenger;
  price: number;
}

export interface BookingDetails {
  id: string;
  trip: Trip;
  user: User;
  total_price: number;
  remaining_amount: number;
  tickets: Ticket[];
}

// Format seat number utility function
export function formatSeatNumber(num: number): string {
  const str = num.toString();
  const rowNumber = parseInt(str.slice(0, -1), 10);
  const seatNumber = parseInt(str.slice(-1), 10);

  // Convert rowNumber to letter(s)
  let rowLabel = "";
  let n = rowNumber;
  while (n > 0) {
    n--; // adjust for 0-based index
    rowLabel = String.fromCharCode(65 + (n % 26)) + rowLabel;
    n = Math.floor(n / 26);
  }

  return `${rowLabel}${seatNumber}`;
}

// Generate barcode data URL
export function generateBarcode(text: string): string {
  try {
    const canvas = document.createElement("canvas");
    // JsBarcode.toCanvas(canvas, {
    //   bcid: "code128",
    //   text: text,
    //   scale: 2,
    //   height: 20,
    //   includetext: true,
    //   textxalign: "center",
    // });
    JsBarcode(canvas, text, {
    format: "CODE128",
    
    displayValue: true,
  });
    return canvas.toDataURL("image/png");
  } catch (e) {
    console.error("Barcode generation error:", e);
    return "/images/sample-barcode.png";
  }
}

// Generate the ticket HTML
function generateTicketHTML(bookingDetails: TicketRegistrationDataType,dictionary:GeneralDictionary): string {
  const leftBarcodeUrl = generateBarcode(`BUS-${bookingDetails.id}-L`);
  const rightBarcodeUrl = generateBarcode(`BUS-${bookingDetails.id}-R`);
  
  return `
  <div class="ticket-container" style="
    position: relative;
    z-index: 10;
    width: 100%;
    min-width: 750px;
    background: white;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    border-radius: 0.375rem;
    overflow: hidden;
    border: 2px dashed #6b7280;
    border-image: repeating-linear-gradient(45deg,#6b7280,#6b7280 5px,transparent 5px,transparent 10px) 10;
  ">

    <!-- Watermark -->
    <div style="
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 0;
    ">
      <h1 style="
        font-size: 100px;
        font-weight: 800;
        color: #374151;
        opacity: 0.1;
        user-select: none;
        text-align: center;
        line-height: 1;
      ">MILLIEKIT</h1>
    </div>

    <!-- Header (Desktop) -->
    <div style="
      display: flex;
      background: #6B21A8;
      color: white;
      font-size: 12px;
      font-weight: bold;
    ">
      <div style="
        flex: 1;
        text-align: right;
        padding: 12px 16px;
        border-right: 1px dashed white;
      ">
        ${dictionary.vendorAgentBusOperator}
      </div>
      <div style="
        width: 1px;
        background: linear-gradient(to bottom,#9ca3af,transparent,#9ca3af);
        background-size: 2px 6px;
        background-repeat: repeat-y;
      "></div>
      <div style="flex: 2; text-align: right; padding: 12px 16px;">
        ${dictionary.customer}
      </div>
    </div>

    <!-- Body -->
    <div style="display: flex; flex-direction: row;">
      <!-- Left Section -->
      <div style="flex: 1; padding: 12px;">
        <div style="
          background: #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px 12px;
          border-radius: 4px 4px 0 0;
        ">
          <div style="font-size: 12px; font-weight: bold;">
            ${bookingDetails.trip.route.origin_city.name}
          </div>
          <div style="height: 24px; width: 24px;">🚌</div>
          <div style="font-size: 12px; font-weight: bold;">
            ${bookingDetails.trip.route.destination_city.name}
          </div>
        </div>

        <!-- Info Grid -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          font-size: 12px;
          margin: 8px;
        ">
          <div style="color: #6b7280;">${dictionary.bus}</div>
          <div style="font-weight: bold;">${bookingDetails.trip.bus.name}</div>

          <div style="color: #6b7280;">${dictionary.traveler}</div>
          <div style="font-weight: bold;">${bookingDetails.user.first_name}</div>

          <div style="color: #6b7280;">${dictionary.totalAmount}</div>
          <div style="font-weight: bold;">${bookingDetails.total_price}</div>

          <div style="color: #6b7280;">${dictionary.remainingAmount}</div>
          <div style="font-weight: bold;">${bookingDetails.remaining_amount}</div>

          <div style="color: #6b7280;">${dictionary.seatNumber}</div>
          <div style="font-weight: bold;">
            ${bookingDetails.tickets.map(ticket => formatSeatNumber(ticket.seat_number)).join(", ")}
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div style="
        width: 1px;
        background: linear-gradient(to bottom,#9ca3af,transparent,#9ca3af);
        background-size: 2px 6px;
        background-repeat: repeat-y;
      "></div>

      <!-- Right Section -->
      <div style="flex: 2; padding: 12px;">
        <div style="
          background: #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px 12px;
          border-radius: 4px 4px 0 0;
        ">
          <div style="font-size: 16px; font-weight: bold; text-align: center;">
            ${bookingDetails.trip.route.origin_city.name}
            <div style="font-size: 12px; color: #6b7280;">
              (${bookingDetails.trip.route.origin_station.name})
            </div>
          </div>
          <div style="height: 40px; width: 40px;">🚌</div>
          <div style="font-size: 16px; font-weight: bold; text-align: center;">
            ${bookingDetails.trip.route.destination_city.name}
            <div style="font-size: 12px; color: #6b7280;">
              (${bookingDetails.trip.route.destination_station.name})
            </div>
          </div>
        </div>

        <!-- Passenger Table -->
        <div style="
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 12px;
          overflow: hidden;
        ">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead style="background: #f9fafb;">
              <tr>
                <th style="padding: 6px 8px; text-align: left; color: #6b7280;">${dictionary.passenger}</th>
                <th style="padding: 6px 8px; text-align: left; color: #6b7280;">${dictionary.seatNumber}</th>
                <th style="padding: 6px 8px; text-align: left; color: #6b7280;">${dictionary.ticketPrice}</th>
              </tr>
            </thead>
            <tbody>
              ${bookingDetails.tickets.map((ticket, i) => `
                <tr style="background: ${i % 2 === 0 ? 'white' : '#f9fafb'};">
                  <td style="padding: 6px 8px; font-weight: 500; color: #1f2937;">
                    ${ticket.passenger.first_name}
                  </td>
                  <td style="padding: 6px 8px; color: #6b7280;">
                    ${formatSeatNumber(ticket.seat_number)}
                  </td>
                  <td style="padding: 6px 8px; color: #6b7280;">
                    ${ticket.price}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <!-- Extra Info Grid -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 12px;
        ">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">${dictionary.busNumber}</span>
            <span style="font-weight: bold;">${bookingDetails.trip.bus.bus_number}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">${dictionary.traveler}</span>
            <span style="font-weight: bold;">
              ${bookingDetails.user.first_name} ${bookingDetails.user.last_name}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">${dictionary.totalAmount}</span>
            <span style="font-weight: bold;">${bookingDetails.total_price}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">${dictionary.remainingAmount}</span>
            <span style="font-weight: bold;">${bookingDetails.remaining_amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">${dictionary.departureTime}</span>
            <span style="font-weight: bold;">${bookingDetails.trip.departure_time}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #6b7280;">${dictionary.arrivalTime}</span>
            <span style="font-weight: bold;">${bookingDetails.trip.arrival_time}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Barcodes -->
    <div style="
      display: flex;
      background: #e5e7eb;
      height: 80px;
      margin-top: 8px;
    ">
      <div style="flex: 1; display: flex; justify-content: end; align-items: center; padding: 12px;">
        <img src="${leftBarcodeUrl}" alt="barcode-left" style="width: 96px; height: auto;" />
      </div>
      <div style="
        width: 1px;
        background: linear-gradient(to bottom,#9ca3af,transparent,#9ca3af);
        background-size: 2px 6px;
        background-repeat: repeat-y;
      "></div>
      <div style="flex: 2; display: flex; justify-content: end; align-items: center; padding: 12px;">
        <img src="${rightBarcodeUrl}" alt="barcode-right" style="width: 128px; height: auto;" />
      </div>
    </div>
  </div>
`;

}

// Main function to download ticket as PDF
export async function downloadBusTicket(
  bookingDetails: TicketRegistrationDataType,
  dictionary:GeneralDictionary
): Promise<void> {
  try {
    // Create a temporary container for the ticket
    const container = document.createElement('div');
    container.innerHTML = generateTicketHTML(bookingDetails,dictionary);
    document.body.appendChild(container);
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Capture the ticket as an image
    const canvas = await html2canvas(container, {
      scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: 800, // Fixed width for desktop layout
        windowHeight: container.scrollHeight + 100,
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Convert canvas to image data
    const imgData = canvas.toDataURL("image/png");
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
    });

    const a4Width = 210;
    const a4Height = 297;
    const margin = 15;
    const imgProps = pdf.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;
    const contentWidth = a4Width - 2 * margin;
    const maxContentHeight = a4Height - 2 * margin;
    const contentHeight = Math.min(contentWidth / imgRatio, maxContentHeight);

    // Add image to PDF
    pdf.addImage(imgData, "PNG", margin, margin, contentWidth, contentHeight);
    
    // Save PDF
    pdf.save(`bus-ticket-${bookingDetails?.id || "ticket"}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

// Add this function to your existing utils/ticketGenerator.ts file

// Function to share ticket via various platforms
export async function shareBusTicket(
  bookingDetails: TicketRegistrationDataType,
  dictionary: GeneralDictionary
): Promise<void> {
  try {
    // Create a temporary container for the ticket
    const container = document.createElement('div');
    container.innerHTML = generateTicketHTML(bookingDetails, dictionary);
    document.body.appendChild(container);
    
    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Capture the ticket as an image
    const canvas = await html2canvas(container, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: 800,
      windowHeight: container.scrollHeight + 100,
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Convert canvas to image data
    const imgData = canvas.toDataURL("image/png");
    
    // Create a blob from the image data
    const blob = await (await fetch(imgData)).blob();
    
    // Create share data
    const shareData: Share = {
      title: `${dictionary.busTicket || 'Bus Ticket'} - ${bookingDetails.id}`,
      text: `${dictionary.shareTicketText || 'Check out my bus ticket!'}\n\n` +
            `${dictionary.from}: ${bookingDetails.trip.route.origin_city.name} (${bookingDetails.trip.route.origin_station.name})\n` +
            `${dictionary.to}: ${bookingDetails.trip.route.destination_city.name} (${bookingDetails.trip.route.destination_station.name})\n` +
            `${dictionary.departureTime}: ${bookingDetails.trip.departure_time}\n` +
            `${dictionary.arrivalTime}: ${bookingDetails.trip.arrival_time}\n` +
            `${dictionary.passengers}: ${bookingDetails.tickets.length}\n` +
            `${dictionary.totalAmount}: ${bookingDetails.total_price}`,
    };

    // Check if Web Share API is available (mobile devices)
    if (navigator.share && navigator.canShare) {
      // Prepare files array for sharing
      const filesArray = [
        new File([blob], `bus-ticket-${bookingDetails.id}.png`, {
          type: blob.type,
        }),
      ];

      // Check if files can be shared
      if (navigator.canShare({ files: filesArray })) {
        shareData.files = filesArray;
      }

      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Web Share API failed, falling back to custom share options', err);
      }
    }

    // Fallback for desktop or when Web Share API is not available
    // Create a modal with share options
    createShareModal(bookingDetails, imgData, dictionary);
  } catch (error) {
    console.error("Error sharing ticket:", error);
    throw error;
  }
}

// Helper function to create a share modal
function createShareModal(
  bookingDetails: TicketRegistrationDataType, 
  imgData: string, 
  dictionary: GeneralDictionary
): void {
  // Create modal container
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  modal.style.display = 'flex';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '1000';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.width = '300px';
  modalContent.style.textAlign = 'center';
  
  // Create title
  const title = document.createElement('h3');
  title.textContent = dictionary.shareTicket || 'Share Ticket';
  title.style.marginBottom = '20px';
  modalContent.appendChild(title);
  
  // Create share options
  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '📱',
      color: '#25D366',
      action: () => shareViaWhatsApp(bookingDetails, imgData, dictionary)
    },
    {
      name: 'Facebook',
      icon: '👥',
      color: '#4267B2',
      action: () => shareViaFacebook(bookingDetails, dictionary)
    },
    {
      name: 'Email',
      icon: '✉️',
      color: '#EA4335',
      action: () => shareViaEmail(bookingDetails, imgData, dictionary)
    },
    {
      name: 'Download',
      icon: '📥',
      color: '#6B7280',
      action: () => {
        downloadBusTicket(bookingDetails, dictionary);
        document.body.removeChild(modal);
      }
    }
  ];
  
  // Create buttons for each share option
  shareOptions.forEach(option => {
    const button = document.createElement('button');
    button.innerHTML = `${option.icon} ${option.name}`;
    button.style.display = 'block';
    button.style.width = '100%';
    button.style.padding = '10px';
    button.style.margin = '10px 0';
    button.style.backgroundColor = option.color;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    
    button.addEventListener('click', () => {
      option.action();
      document.body.removeChild(modal);
    });
    
    modalContent.appendChild(button);
  });
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = dictionary.close || 'Close';
  closeButton.style.marginTop = '15px';
  closeButton.style.padding = '8px 16px';
  closeButton.style.backgroundColor = '#6B7280';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '4px';
  closeButton.style.cursor = 'pointer';
  
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Share via WhatsApp
function shareViaWhatsApp(
  bookingDetails: TicketRegistrationDataType, 
  imgData: string, 
  dictionary: GeneralDictionary
): void {
  const text = encodeURIComponent(
    `${dictionary.shareTicketText || 'Check out my bus ticket!'}\n\n` +
    `*${dictionary.from}:* ${bookingDetails.trip.route.origin_city.name} (${bookingDetails.trip.route.origin_station.name})\n` +
    `*${dictionary.to}:* ${bookingDetails.trip.route.destination_city.name} (${bookingDetails.trip.route.destination_station.name})\n` +
    `*${dictionary.departureTime}:* ${bookingDetails.trip.departure_time}\n` +
    `*${dictionary.arrivalTime}:* ${bookingDetails.trip.arrival_time}\n` +
    `*${dictionary.passengers}:* ${bookingDetails.tickets.length}\n` +
    `*${dictionary.totalAmount}:* ${bookingDetails.total_price}`
  );
  
  // Create a temporary link to download the image first
  const link = document.createElement('a');
  link.href = imgData;
  link.download = `bus-ticket-${bookingDetails.id}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Open WhatsApp with the text (user can manually attach the downloaded image)
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

// Share via Facebook
function shareViaFacebook(
  bookingDetails: TicketRegistrationDataType, 
  dictionary: GeneralDictionary
): void {
  const text = encodeURIComponent(
    `${dictionary.shareTicketText || 'Check out my bus ticket!'}\n\n` +
    `${dictionary.from}: ${bookingDetails.trip.route.origin_city.name} (${bookingDetails.trip.route.origin_station.name})\n` +
    `${dictionary.to}: ${bookingDetails.trip.route.destination_city.name} (${bookingDetails.trip.route.destination_station.name})\n` +
    `${dictionary.departureTime}: ${bookingDetails.trip.departure_time}\n` +
    `${dictionary.arrivalTime}: ${bookingDetails.trip.arrival_time}`
  );
  
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${text}`, '_blank');
}

// Share via Email
function shareViaEmail(
  bookingDetails: TicketRegistrationDataType, 
  imgData: string, 
  dictionary: GeneralDictionary
): void {
  const subject = encodeURIComponent(`${dictionary.busTicket || 'Bus Ticket'} - ${bookingDetails.id}`);
  const body = encodeURIComponent(
    `${dictionary.shareTicketText || 'Check out my bus ticket!'}\n\n` +
    `${dictionary.from}: ${bookingDetails.trip.route.origin_city.name} (${bookingDetails.trip.route.origin_station.name})\n` +
    `${dictionary.to}: ${bookingDetails.trip.route.destination_city.name} (${bookingDetails.trip.route.destination_station.name})\n` +
    `${dictionary.departureTime}: ${bookingDetails.trip.departure_time}\n` +
    `${dictionary.arrivalTime}: ${bookingDetails.trip.arrival_time}\n` +
    `${dictionary.passengers}: ${bookingDetails.tickets.length}\n` +
    `${dictionary.totalAmount}: ${bookingDetails.total_price}\n\n` +
    `${dictionary.ticketAttached || 'Ticket attached as image.'}`
  );
  
  // Create a mailto link
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  
  // Create a temporary link to download the image first
  const link = document.createElement('a');
  link.href = imgData;
  link.download = `bus-ticket-${bookingDetails.id}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Open email client
  window.location.href = mailtoLink;
}