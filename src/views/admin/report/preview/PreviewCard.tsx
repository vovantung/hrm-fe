// MUI Imports

// import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// import Divider from '@mui/material/Divider'
import { format } from 'date-fns'
import { Button, Icon } from '@mui/material'

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
  const { settings } = useSettings()
  const now = new Date()
  const reportedWeeklyList = useSelector((state: any) => state.reportWeekly.reportedWeekly) as ReportedWeeklyDataType[]
  const dateFrom = useSelector((state: any) => state.common.dateFrom) as Date | null | undefined
  const dateTo = useSelector((state: any) => state.common.dateTo) as Date | null | undefined

  // Handle Print Button Click
  const handleButtonClick = () => {
    window.print()
  }

  return (
    <div
      style={{
        height: settings.layout == 'horizontal' ? 'calc(100vh - 274px)' : 'calc(100vh - 230px)',
        minHeight: '156px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 314px)' : 'calc(100vh - 330px)',
          overflowY: 'auto',
          marginBottom: '20px',
          height: settings.layout == 'horizontal' ? 'calc(100vh - 374px)' : 'calc(100vh - 300px)'
        }}
      >
        <div style={{ maxWidth: '950px' }}>
          <div id='print-area'>
            <Grid container spacing={6}>
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
                        borderTop: '0.8px solid #000000',
                        marginTop: '3px',
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
                        borderTop: '0.8px solid #000000',
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
                        <th>
                          <strong>Đơn vị</strong>
                        </th>
                        <th>
                          <strong>Tên báo cáo</strong>
                        </th>
                        <th>
                          <strong>Ngày báo cáo</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportedWeeklyList?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.department.name}</td>
                          <td className='report-name'>{item.originName}</td>
                          <td>{format(new Date(item.uploadedAt), 'dd/MM/yyyy HH:mm')}</td>
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
      <hr
        style={{
          border: 'none',
          borderTop: '0.6px solid #cccccc97',
          marginTop: '10px'
        }}
      />
      <div style={{ padding: '20px', paddingLeft: '24px' }}>
        <Button
          startIcon={<Icon className='ph-printer-bold'></Icon>}
          color='primary'
          size='medium'
          variant='contained'
          onClick={handleButtonClick}
        >
          Print
        </Button>
      </div>
    </div>
  )
}

export default PreviewCard
