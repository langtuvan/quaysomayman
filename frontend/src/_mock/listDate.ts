const ThisYear = 2025
const NextYear = 2026



// Vietnamese calendar events
export const VietNamListDate = [
  { name: 'Tết Dương lịch', date: `${NextYear}-01-01`, time: '00:00:00' },
  { name: 'Lễ Tình nhân', date: `${ThisYear}-02-14`, time: '00:00:00' },
  { name: 'Quốc tế Phụ nữ', date: `${ThisYear}-03-08`, time: '00:00:00' },
  { name: 'Giỗ Tổ Hùng Vương', date: `${ThisYear}-04-07`, time: '00:00:00' },
  { name: 'Ngày Thống nhất', date: `${ThisYear}-04-30`, time: '00:00:00' },
  { name: 'Quốc tế Lao động', date: `${ThisYear}-05-01`, time: '00:00:00' },
  { name: 'Quốc khánh', date: `${ThisYear}-09-02`, time: '00:00:00' },
  { name: 'Phụ nữ Việt Nam', date: `${ThisYear}-10-20`, time: '00:00:00' },
  { name: 'Halloween', date: `${ThisYear}-10-31`, time: '00:00:00' },
  { name: 'Nhà giáo Việt Nam', date: `${ThisYear}-11-20`, time: '00:00:00' },
  { name: 'Giáng sinh', date: `${ThisYear}-12-25`, time: '00:00:00' },
  { name: 'Giao thừa', date: `${NextYear}-01-01`, time: '00:00:00' },
]
  .map((event, index) => ({
    id: index.toString(),
    ...event,
    timestamp: new Date(`${event.date} ${event.time}`).getTime(),
  }))
  .filter((event) => event.timestamp > Date.now()) // Only show future events
  .sort((a, b) => a.timestamp - b.timestamp) // Sort by closest date first
