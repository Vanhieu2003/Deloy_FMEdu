﻿using Project.Dto;
using Project.Entities;
using Project.Interface;

namespace Project.Repository
{
    public class QRScannerRepository : IQRScannerRepository
    {
        private readonly HcmUeQTTB_DevContext _context;

        public QRScannerRepository(HcmUeQTTB_DevContext context) {
            _context = context;
        }
        public async Task<QRDto> getInfoByRoomCode(string roomCode)
        {
            // Tìm Room dựa trên roomCode
            var room = _context.Rooms.FirstOrDefault(r => r.RoomCode == roomCode);
            var checkFormExist = _context.CleaningForms.FirstOrDefault(cf => cf.RoomId == room.Id);
            if ( checkFormExist == null)
            {
                throw new ArgumentException("Chưa có form đánh giá cho phòng này");
            }

            // Lấy BlockId và CampusId từ Block liên quan đến Room
            var block = _context.Blocks.FirstOrDefault(b => b.Id == room.BlockId);
           
            // Xác định thời gian hiện tại
            var currentTime = DateTime.Now.TimeOfDay;

            // Lấy ShiftId hợp lệ theo thời gian và roomCategoryId
            var shift = _context.Shifts
                .Where(s => s.RoomCategoryId == room.RoomCategoryId
                            && s.StartTime <= currentTime
                            && currentTime <= s.EndTime
                            && s.Status == "ENABLE")
                .FirstOrDefault();

            // Tạo response
            var response = new QRDto
            {
                CampusId = block.CampusId,
                BlockId = room.BlockId,
                FloorId = room.FloorId,
                RoomId = room.Id,
                ShiftId = shift?.Id
            };

            return response;
        }
    }
}
