// Simple test to verify warranty number generation format
function generateWarrantyNumber(autoIncrementId) {
  const today = new Date();
  const dateString = today.getFullYear().toString() + 
    (today.getMonth() + 1).toString().padStart(2, '0') + 
    today.getDate().toString().padStart(2, '0');
  
  // Format the auto-increment ID to be at least 5 digits
  const formattedId = autoIncrementId.toString().padStart(5, '0');
  
  return `WR-${dateString}-${formattedId}`;
}

// Test the function
console.log('Testing warranty number generation:');
console.log('ID 1:', generateWarrantyNumber(1));
console.log('ID 123:', generateWarrantyNumber(123));
console.log('ID 12345:', generateWarrantyNumber(12345));
console.log('ID 123456:', generateWarrantyNumber(123456));

// Expected format: WR-YYYYMMDD-XXXXX
// Example: WR-20250115-00001



