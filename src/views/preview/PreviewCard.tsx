// MUI Imports

// import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// import Divider from '@mui/material/Divider'
import { format } from 'date-fns'
import { Card, CardContent } from '@mui/material'

// Component Imports

// Style Imports
// import tableStyles from '@core/styles/table.module.css'

import './print.css'

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

const PreviewCard = ({ reportData }: { reportData?: ReportedWeeklyDataType[] }) => {
  return (
    <Card style={{ display: 'flex', justifyContent: 'center' }}>
      <CardContent style={{ maxWidth: '1000px' }}>
        <div className=' print-container' id='print-area'>
          <Grid container spacing={6}>
            <div className='headerWrapper'>
              {/* Cột bên trái */}
              <div className='leftCol'>
                {/* <div className='header-left'> */}
                <div className='header-block'>
                  <div className='font-txu'>TRƯỜNG ĐẠI HỌC ĐỒNG THÁP</div>
                  <div className='bold-txu font-txu'>PHÒNG HÀNH CHÍNH - TỔNG HỢP</div>
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
                  <div className='bold-txu font-txu'>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className='bold-txu font-txu-1'>Độc lập - Tự do - Hạnh phúc</div>
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
                  <div className='font-txu italic-txu'>Đồng Tháp, ngày ..... tháng ...... năm 2025</div>
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

              <p style={{ fontWeight: 'normal' }} className='italic-txu'>
                (Từ ngày {'...'} đến ngày {'....'})
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
                    {reportData?.map((item, index) => (
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
      </CardContent>
    </Card>
  )
}

export default PreviewCard
