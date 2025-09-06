// MUI Imports

// import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// import Divider from '@mui/material/Divider'
import { format } from 'date-fns'
import { Box, Button, useTheme } from '@mui/material'

// Component Imports

// Style Imports
// import tableStyles from '@core/styles/table.module.css'

import './print.css'
import { useSelector } from 'react-redux'

import { useSettings } from '@/@core/hooks/useSettings'

// import Link from 'next/link'

type ReportedWeeklyDataType = {
  id: number
  filename: string
  url: string
  uploadedAt: string
  department: DepartmentDataType
  originName: string
}

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

const PreviewCard = () => {
  const theme = useTheme()
  const { settings } = useSettings()
  const now = new Date()

  const reportedWeeklyList = useSelector(
    (state: any) => state.reportWeekly.reportedWeeklyForAdmin
  ) as ReportedWeeklyDataType[]

  const dateFrom = useSelector((state: any) => state.common.dateFrom) as Date | null | undefined
  const dateTo = useSelector((state: any) => state.common.dateTo) as Date | null | undefined

  // Handle Print Button Click
  const handleButtonClick = () => {
    window.print()
  }

  return (
    <div
      style={{
        height: settings.layout == 'horizontal' ? 'calc(100vh - 266px)' : 'calc(100vh - 226px)',
        minHeight: '114px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 359px)' : 'calc(100vh - 318px)',
          minHeight: settings.layout == 'horizontal' ? '23px' : '23px',
          overflowY: 'auto',

          marginBottom: '20px',
          height: settings.layout == 'horizontal' ? 'calc(100vh - 359px)' : 'calc(100vh - 318px)'
        }}
      >
        <div
          style={{
            maxWidth: '950px'

            //  padding: '10px'
          }}
        >
          <div id='print-area'>
            <Grid container spacing={6} sx={{ padding: '10px', minHeight: '100px' }}>
              <div className='headerWrapper'>
                {/* Cột bên trái */}
                <div className='leftCol'>
                  {/* <div className='header-left'> */}
                  <div className='header-block'>
                    <div style={{ margin: '0px', padding: '0px' }} className='font-txu'>
                      TRƯỜNG ĐẠI HỌC ĐỒNG THÁP
                    </div>
                    <div style={{ margin: '0px', padding: '0px' }} className='bold-txu font-txu'>
                      PHÒNG HÀNH CHÍNH - TỔNG HỢP
                    </div>
                    <hr
                      style={{
                        border: 'none',
                        borderTop: '0.8px solid ',
                        marginTop: '4px',
                        marginLeft: '60px',
                        marginRight: '60px'
                      }}
                    />
                  </div>
                  {/* </div> */}
                </div>

                {/* Cột bên phải */}
                <div className='rightCol'>
                  {/* <div className='header-left'> */}
                  <div className='header-block'>
                    <div style={{ margin: '0px', padding: '0px' }} className='bold-txu font-txu'>
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </div>
                    <div style={{ margin: '0px', padding: '0px' }} className='bold-txu font-txu-1'>
                      Độc lập - Tự do - Hạnh phúc
                    </div>
                    <hr
                      style={{
                        border: 'none',
                        borderTop: '0.8px solid',
                        marginTop: '0px',
                        marginLeft: '60px',
                        marginRight: '60px',
                        marginBottom: '15px'
                      }}
                    />
                    <div className='font-txu italic-txu'>
                      Đồng Tháp, ngày {format(now, 'dd')} tháng {format(now, 'MM')} năm {format(now, 'yyyy')}
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  paddingBottom: '0px',
                  marginBottom: '0px'
                }}
                className='bold-txu font-txu-1'
              >
                <p> THỐNG KÊ BÁO CÁO TUẦN CỦA CÁC ĐƠN VỊ</p>

                <p style={{ fontWeight: 'normal' }} className='italic-txu font-txu'>
                  (Từ ngày {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : '....'} đến ngày{' '}
                  {dateTo ? format(dateTo, 'dd/MM/yyyy') : '....'})
                </p>
              </div>

              <Grid size={{ xs: 12 }}>
                <div className='overflow-x-auto  previewCard'>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center' }}>
                          <strong>STT</strong>
                        </th>
                        <th style={{ textAlign: 'center' }}>
                          <strong>ĐƠN VỊ</strong>
                        </th>
                        <th style={{ textAlign: 'center' }}>
                          <strong>TÊN BÁO CÁO</strong>
                        </th>
                        <th style={{ textAlign: 'center' }}>
                          <strong>NGÀY BÁO CÁO</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportedWeeklyList?.map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'center' }}> {index + 1 < 10 ? '0' + (index + 1) : index + 1}</td>
                          <td style={{ paddingLeft: '6px' }}>{item.department.name}</td>
                          <td
                            style={{ paddingLeft: '6px' }}

                            //  className='report-name'
                          >
                            {item.originName}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {format(new Date(item.uploadedAt), 'dd/MM/yyyy HH:mm')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Grid>

              <div className='headerWrapper'>
                {/* Cột bên trái */}
                <div className='leftCol'></div>

                {/* Cột bên phải */}
                <div className='rightCol'>
                  {/* <div className='header-left'> */}
                  <div className='header-block'>
                    <div style={{ marginRight: '100px', marginBottom: '150px' }} className='bold-txu font-txu'>
                      LÃNH ĐẠO ĐƠN VỊ
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
              {/* <Grid size={{ xs: 12 }}>
              <Divider className='border-dashed' />
              <div style={{ marginTop: '10px' }}>
                <span className='font-txu-0'>{`© ${new Date().getFullYear()}, Made by `}</span>
                <Link className='font-txu-00' href='https://txuyen.com' target='_blank'>
                  TXUYEN
                </Link>
              </div>
            </Grid> */}
            </Grid>
          </div>
        </div>
      </div>
      {/* Tiếp ở đây */}
      <hr
        style={{
          border: 'none',
          borderTop: '0.6px solid #cccccc97',
          marginTop: '0px'
        }}
      />

      <Box
        sx={{
          justifyContent: 'space-between',
          display: 'flex',
          marginLeft: '25px',

          // marginTop: settings.layout == 'horizontal' ? '16px' : '14px',
          marginRight: '20px'
        }}
      >
        <div
          style={{
            color: theme.palette.primary.main,
            margin: '0px',
            padding: '0px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Button
              style={{
                borderRadius: 4
              }}
              startIcon={<i style={{ height: '20px' }} className='ph-printer-bold' />}
              color='primary'
              size='medium'
              variant='contained'
              onClick={handleButtonClick}
            >
              In thống kê
            </Button>
          </div>
        </div>

        <Box
          sx={{
            height: '70px'

            //  visibility: 'hidden'
          }}
        ></Box>
        <div
          style={{
            color: theme.palette.primary.main,

            margin: '0px',
            padding: '0px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <span style={{ fontSize: '13.5px', fontStyle: 'revert' }}>
              Từ <strong>{dateFrom ? format(dateFrom, 'dd/MM/yyyy') : ''}</strong> đến{' '}
              <strong>{dateTo ? format(dateTo, 'dd/MM/yyyy') : ''}</strong> có{' '}
              <strong>
                {reportedWeeklyList.length < 10 ? '0' + reportedWeeklyList.length : reportedWeeklyList.length}
              </strong>{' '}
              báo cáo
            </span>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default PreviewCard
