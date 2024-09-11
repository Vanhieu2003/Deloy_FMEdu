"use client"
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import "src/global.css";
import SendIcon from '@mui/icons-material/Send';
import { useSettingsContext } from 'src/components/settings';
import { Button, FormControl, FormControlLabel, IconButton, InputLabel, Link, MenuItem, Popover, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RenderRatingInput from 'src/sections/components/rating/renderRatingInput';
import { DateTime } from 'luxon';
import BlockService from 'src/@core/service/block';
import FloorService from 'src/@core/service/floor';
import CampusService from 'src/@core/service/campus';
import ShiftService from 'src/@core/service/shift';
import CriteriaService from 'src/@core/service/criteria';
import RoomService from 'src/@core/service/room';
import CleaningReportService from 'src/@core/service/cleaningReport';

dayjs.locale('vi');
interface Campus {
  id: string;
  campusCode: string;
  campusName: string;
  campusName2: string;
  campusSymbol: string;
  sortOrder: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
interface Blocks {
  id: string,
  blockCode: string,
  blockName: string,
  blockName2: string,
  blockNo: string,
  dvtcode: string,
  dvtname: string,
  assetTypeCode: string,
  assetTypeName: string,
  sortOrder: number,
  useDepartmentCode: string,
  useDepartmentName: string,
  manageDepartmentCode: string,
  manageDepartmentName: string,
  floorArea: number,
  contructionArea: number,
  functionCode: string,
  functionName: string,
  valueSettlement: number,
  originalPrice: number,
  centralFunding: number,
  localFunding: number,
  otherFunding: number,
  statusCode: string,
  statusName: string,
  campusCode: string,
  campusName: string,
  campusId: string,
  createdAt: string,
  updatedAt: string
}


type Floor = {
  id: string,
  floorCode: string,
  floorName: string,
  description: string,
  floorOrder: number,
  basementOrder: number,
  sortOrder: number,
  notes: string,
  createdAt: string,
  updatedAt: string
};

type Room = {
  id: string,
  roomCode: string,
  roomName: string,
  description: string,
  roomNo: string,
  dvtcode: string,
  dvtname: string,
  assetTypeCode: string,
  assetTypeName: string,
  useDepartmentCode: string,
  useDepartmentName: string,
  manageDepartmentCode: string,
  manageDepartmentName: string,
  numberOfSeats: number,
  floorArea: number,
  contructionArea: number,
  valueSettlement: number,
  originalPrice: number,
  centralFunding: number,
  localFunding: number,
  otherFunding: number,
  statusCode: string,
  statusName: string,
  sortOrder: number,
  blockId: string,
  roomCategoryId: string,
  floorId: string,
  createdAt: string,
  updatedAt: string,
  roomCategory: null | any,
  lessons: any[]
};

type Shift = {
  id: string,
  shiftName: string,
  startTime: string,
  endTime: string,
  roomCategoryId: string,
  createAt: string,
  updateAt: string
}

type Criteria = {
  id: string,
  criteriaName: string,
  roomCategoryId: string,
  criteriaType: string,
  createAt: string,
  updateAt: string
};



// ----------------------------------------------------------------------

export default function OneView() {
  const [selectedBlocks, setSelectedBlocks] = useState<any>(null);
  const [selectedCampus, setSelectedCampus] = useState<any>(null);
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [campus, setCampus] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);

  const [ratingTypesSelected, setRatingTypesSelected] = useState<{ [key: string]: string }>({});
  const [ratingValues, setRatingValues] = useState<{ [key: number]: any }>({});

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentCriteriaID, setCurrentCriteriaID] = useState<string | null>(null);

  const settings = useSettingsContext();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;



  //Function for the website
  const handleTypeChange = (criteriaID: string, event: React.ChangeEvent<{ value: string }>) => {
    setRatingTypesSelected(prevTypes => ({
      ...prevTypes,
      [criteriaID]: event.target.value as string,
    }));
    setRatingValues(prevValues => ({
      ...prevValues,
      [criteriaID]: null, // Reset the rating value when type changes
    }));
    handleClose(); // Close the popover after changing the type
  };

  const handleValueChange = (criteriaID: string, value: any) => {
    setRatingValues(prevValues => ({
      ...prevValues,
      [criteriaID]: value,
    }));
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>, criteriaID: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentCriteriaID(criteriaID);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setCurrentCriteriaID(null);
  };


  useEffect(() => {
    const fetchCampus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await CampusService.getAllCampus();
        console.log('Dữ liệu Campus:', response.data);
        setCampus(response.data);
      } catch (error) {
        setError(error.message);
        console.error('Chi tiết lỗi:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampus();
  }, []);



  const handleCampusSelect = async (CampusId: string) => {
    var campusId = CampusId;
    try {
      const response = await BlockService.getBlockByCampusId(campusId);
      setBlocks(response.data);
      setFloors([]);
      setRooms([]);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };
  const handleBlockSelect = async (blockId: string) => {
    var blockId = blockId;

    try {
      const response = await FloorService.getFloorByBlockId(blockId);
      if (response.data.length > 0) {
        setFloors(response.data);
        console.log(response.data);
        setRooms([]);
      }
      else {
        setFloors([]);
        setRooms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleFloorSelect = async (floorId: string) => {
    var floorId = floorId;

    try {
      const response = await RoomService.getRoomsByFloorId(floorId);
      if (response.data.length > 0) {
        setRooms(response.data);
      }
      else {
        setRooms([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleRoomSelect = async (roomId: string) => {
    const selectedRoom = rooms.find(room => room.id === roomId);
    if (selectedRoom && selectedRoom.roomCategoryId) {
      try {
        const response = await ShiftService.getShiftsByRoomCategoricalId(selectedRoom.roomCategoryId);
        setShifts(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách ca:', error);
      }
    } else {
      console.error('Không tìm thấy phòng hoặc phòng không có roomCategoryId');
      setShifts([]);
    }
  };


  const handleShiftSelect = async (ShiftId: string) => {
    const selectedRoomCriteria = shifts.find(shifts => shifts.id === ShiftId);
    setSelectedShift(ShiftId);
    if (selectedRoomCriteria && selectedRoomCriteria.roomCategoryId) {
      try {
        const response = await CriteriaService.getCriteriaByRoomCategoryId(selectedRoomCriteria.roomCategoryId);
        setCriteria(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tiêu chí:', error);
      }
    } else {
      console.error('Không tìm thấy phòng hoặc phòng không có roomCategoryId');
      setCriteria([]);
    }
  };

  const handleSubmit = async () => {
    const data = {
      "formId": "1",
      "shiftId": selectedShift,
      "value": 88,
      "createAt": DateTime.now().toISO(),
      "updateAt": DateTime.now().toISO()
    }
    const response = await CleaningReportService.PostReport(data);
    console.log(response.data);
  };

  //UI of the website
  return (
    <Container maxWidth={false ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4"> Page One </Typography>

        <Button variant="contained" href="/dashboard/group" sx={{ height: '40px' }}>
          Tạo form đánh giá
        </Button>
      </Box>

      <Box
        sx={{
          mt: 5,
          width: 1,
          minHeight: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            marginBottom: 2,
          }}>
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={campus}
              getOptionLabel={(option: any) => option.campusName || ''}
              value={campus.find((c: any) => c.id === selectedCampus) || null}
              onChange={(event, newValue) => {
                if(newValue){
                  setSelectedCampus(newValue ? newValue.id : null);
                  handleCampusSelect(newValue ? newValue.id : '');
                }
                else{
                  setSelectedCampus(null);
                  setBlocks([]);
                  setSelectedBlocks(null);
                  setFloors([]);
                  setSelectedFloor(null);
                  setRooms([]);
                  setSelectedRoom(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn cơ sở"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu cơ sở"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={blocks}
              getOptionLabel={(option: any) => option.blockName || ''}
              value={selectedBlocks}
              onChange={(event, newValue) => {
                if(newValue){
                  setSelectedBlocks(newValue);
                  handleBlockSelect(newValue ? newValue.id : '');
                }
                else{
                  setSelectedBlocks(null);
                  setFloors([]);
                  setRooms([]);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn tòa nhà"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu tòa nhà"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={floors}
              getOptionLabel={(option: Floor) => option.floorName || ''}
              value={floors.find(floor => floor.id === selectedFloor) || null}
              onChange={(event, newValue) => {
                if(newValue){
                  setSelectedFloor(newValue ? newValue.id : null);
                  handleFloorSelect(newValue ? newValue.id : '');
                }
                else{
                  setSelectedFloor(null);
                  setRooms([]);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn tầng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu tầng"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={rooms}
              getOptionLabel={(option: any) => option.roomName || ''}
              value={rooms.find(room => room.id === selectedRoom) || null}
              onChange={(event, newValue) => {
                if(newValue){ 
                  setSelectedRoom(newValue ? newValue.id : null);
                  handleRoomSelect(newValue ? newValue.id : '');
                }
                else{
                  setSelectedRoom(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn phòng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu phòng"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={shifts}
              getOptionLabel={(option: any) => `${option.shiftName} (${option.startTime.substring(0, 5)} - ${option.endTime.substring(0, 5)})`}
              value={shifts.find(shift => shift.id === selectedShift) || null}
              onChange={(event, newValue) => {
                setSelectedShift(newValue ? newValue.id : null);
                handleShiftSelect(newValue ? newValue.id : '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn ca"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu ca"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{ width: 1 }}>
                <TableRow>
                  <TableCell align='center'>Tiêu chí</TableCell>
                  <TableCell align="center">Đánh giá</TableCell>
                  <TableCell align="center">Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {criteria.map(criterion => (
                  <TableRow
                    key={criterion.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, margin: '10px 0' }}
                  >
                    <TableCell component="th" scope="row" align='center'>
                      {criterion.criteriaName}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <RenderRatingInput criteriaID={criterion.id} inputRatingType={criterion.criteriaType} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <TextField fullWidth sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                          },
                        },
                      }} placeholder=''
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {criteria.length !== 0 &&
          <Button variant="contained" endIcon={<SendIcon />} sx={{ mt: 'auto', alignSelf: 'flex-end', mb: 2, mr: 2 }} onClick={handleSubmit}>
            Send
          </Button>}
      </Box>

    </Container>
  );
}
