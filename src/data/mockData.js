

export const hospitals = [
  { id: "H001", name: "City General Hospital", address: "123 Main Street", city: "Mumbai", type: "Government", beds: 500, availableBeds: 45, status: "Active", phone: "+91 22 1234 5678", lat: 19.076, lng: 72.8777 },
  { id: "H002", name: "Apollo Medical Center", address: "456 Park Avenue", city: "Delhi", type: "Private", beds: 300, availableBeds: 22, status: "Active", phone: "+91 11 2345 6789", lat: 28.6139, lng: 77.209 },
  { id: "H003", name: "LifeCare Hospital", address: "789 Lake Road", city: "Bangalore", type: "Private", beds: 200, availableBeds: 0, status: "Active", phone: "+91 80 3456 7890", lat: 12.9716, lng: 77.5946 },
  { id: "H004", name: "Community Health Center", address: "321 Village Lane", city: "Pune", type: "NGO", beds: 100, availableBeds: 15, status: "Active", phone: "+91 20 4567 8901", lat: 18.5204, lng: 73.8567 },
  { id: "H005", name: "Metro Hospital", address: "654 Ring Road", city: "Chennai", type: "Government", beds: 400, availableBeds: 60, status: "Active", phone: "+91 44 5678 9012", lat: 13.0827, lng: 80.2707 },
  { id: "H006", name: "Sunrise Medical", address: "987 Hill Top", city: "Kolkata", type: "Private", beds: 250, availableBeds: 8, status: "Inactive", phone: "+91 33 6789 0123", lat: 22.5726, lng: 88.3639 },
  { id: "H007", name: "Green Valley Hospital", address: "147 Forest Path", city: "Hyderabad", type: "Government", beds: 350, availableBeds: 30, status: "Active", phone: "+91 40 7890 1234", lat: 17.385, lng: 78.4867 },
  { id: "H008", name: "Care & Cure Clinic", address: "258 Market Street", city: "Ahmedabad", type: "NGO", beds: 80, availableBeds: 12, status: "Active", phone: "+91 79 8901 2345", lat: 23.0225, lng: 72.5714 },
];

export const ambulances = [
  { id: "A001", vehicleNumber: "MH-01-AB-1234", hospitalId: "H001", hospitalName: "City General Hospital", driver: "Rajesh Kumar", phone: "+91 98765 43210", type: "Advanced", status: "Available", lat: 19.08, lng: 72.88 },
  { id: "A002", vehicleNumber: "DL-02-CD-5678", hospitalId: "H002", hospitalName: "Apollo Medical Center", driver: "Amit Singh", phone: "+91 98765 43211", type: "ICU", status: "On Trip", lat: 28.62, lng: 77.21 },
  { id: "A003", vehicleNumber: "KA-03-EF-9012", hospitalId: "H003", hospitalName: "LifeCare Hospital", driver: "Suresh Patil", phone: "+91 98765 43212", type: "Basic", status: "Available", lat: 12.97, lng: 77.60 },
  { id: "A004", vehicleNumber: "MH-04-GH-3456", hospitalId: "H004", hospitalName: "Community Health Center", driver: "Vikram Joshi", phone: "+91 98765 43213", type: "Advanced", status: "Maintenance", lat: 18.52, lng: 73.86 },
  { id: "A005", vehicleNumber: "TN-05-IJ-7890", hospitalId: "H005", hospitalName: "Metro Hospital", driver: "Karthik Rajan", phone: "+91 98765 43214", type: "ICU", status: "On Trip", lat: 13.09, lng: 80.27 },
  { id: "A006", vehicleNumber: "WB-06-KL-2345", hospitalId: "H006", hospitalName: "Sunrise Medical", driver: "Debashis Roy", phone: "+91 98765 43215", type: "Basic", status: "Available", lat: 22.57, lng: 88.37 },
  { id: "A007", vehicleNumber: "TS-07-MN-6789", hospitalId: "H007", hospitalName: "Green Valley Hospital", driver: "Ravi Teja", phone: "+91 98765 43216", type: "Advanced", status: "Available", lat: 17.39, lng: 78.49 },
  { id: "A008", vehicleNumber: "GJ-08-OP-0123", hospitalId: "H008", hospitalName: "Care & Cure Clinic", driver: "Harsh Patel", phone: "+91 98765 43217", type: "Basic", status: "On Trip", lat: 23.02, lng: 72.57 },
  { id: "A009", vehicleNumber: "MH-01-QR-4567", hospitalId: "H001", hospitalName: "City General Hospital", driver: "Sanjay Desai", phone: "+91 98765 43218", type: "ICU", status: "Available", lat: 19.07, lng: 72.87 },
  { id: "A010", vehicleNumber: "DL-02-ST-8901", hospitalId: "H002", hospitalName: "Apollo Medical Center", driver: "Manish Gupta", phone: "+91 98765 43219", type: "Advanced", status: "Available", lat: 28.61, lng: 77.20 },
];

export const recentActivities = [
  { id: 1, message: "Ambulance A002 dispatched to emergency", time: "2 min ago", type: "dispatch" },
  { id: 2, message: "New hospital 'Green Valley' registered", time: "15 min ago", type: "hospital" },
  { id: 3, message: "Ambulance A005 returned from trip", time: "32 min ago", type: "return" },
  { id: 4, message: "Ambulance A004 sent for maintenance", time: "1 hr ago", type: "maintenance" },
  { id: 5, message: "Apollo Medical Center updated bed count", time: "2 hr ago", type: "hospital" },
  { id: 6, message: "Ambulance A008 dispatched to emergency", time: "3 hr ago", type: "dispatch" },
];
