'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Plus, Wrench, AlertTriangle, FileText, Settings, User, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [motorcycles, setMotorcycles] = useState([])
  const [recentServices, setRecentServices] = useState([])
  const [upcomingReminders, setUpcomingReminders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Cek user login
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
      loadData(JSON.parse(userData))
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadData = async (user: any) => {
    try {
      // Load motorcycles
      const motorcyclesResponse = await fetch(`/api/motorcycles?userId=${user.id}`)
      if (motorcyclesResponse.ok) {
        const motorcyclesData = await motorcyclesResponse.json()
        setMotorcycles(motorcyclesData)
      }

      // Load service records
      const servicesResponse = await fetch(`/api/service-records?userId=${user.id}`)
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setRecentServices(servicesData.slice(0, 5)) // Show only 5 most recent
      }

      // Load reminders
      const remindersResponse = await fetch(`/api/reminders?userId=${user.id}&activeOnly=true`)
      if (remindersResponse.ok) {
        const remindersData = await remindersResponse.json()
        setUpcomingReminders(remindersData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MotorCare</h1>
                <p className="text-sm text-muted-foreground">Sistem Pencatat Riwayat Servis Motor</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.name || user.email}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/motorcycle/add">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Plus className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Tambah Motor</h3>
                <p className="text-sm text-muted-foreground">Daftarkan motor baru</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/service/add">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Wrench className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Catat Servis</h3>
                <p className="text-sm text-muted-foreground">Tambah riwayat servis</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/complaint">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <AlertTriangle className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Analisis Keluhan</h3>
                <p className="text-sm text-muted-foreground">Dapatkan rekomendasi</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/history">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Riwayat Lengkap</h3>
                <p className="text-sm text-muted-foreground">Lihat semua catatan</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="motorcycles">Motor Saya</TabsTrigger>
            <TabsTrigger value="services">Servis Terakhir</TabsTrigger>
            <TabsTrigger value="reminders">Reminder</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Motor</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{motorcycles.length}</div>
                  <p className="text-xs text-muted-foreground">Motor terdaftar</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Servis Bulan Ini</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentServices.length}</div>
                  <p className="text-xs text-muted-foreground">Riwayat servis</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reminder Aktif</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingReminders.length}</div>
                  <p className="text-xs text-muted-foreground">Perlu perhatian</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="motorcycles" className="space-y-4">
            {motorcycles.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada motor terdaftar</h3>
                  <p className="text-muted-foreground mb-4">Mulai dengan menambahkan motor pertama Anda</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Motor
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {motorcycles.map((motor) => (
                  <Card key={motor.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{motor.brand} {motor.model}</CardTitle>
                          <CardDescription>{motor.variant} • {motor.year}</CardDescription>
                        </div>
                        <Badge variant="secondary">{motor.plateNumber}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">KM Saat Ini:</span>
                          <span className="font-medium">{motor.currentKm.toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Penggunaan:</span>
                          <span className="font-medium capitalize">{motor.usageType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">STNK Berlaku:</span>
                          <span className="font-medium">{new Date(motor.stnkExpiry).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            {recentServices.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada riwayat servis</h3>
                  <p className="text-muted-foreground mb-4">Catat servis pertama untuk melacak perawatan motor</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Catat Servis
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recentServices.map((service) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{service.motorcycle.brand} {service.motorcycle.model}</CardTitle>
                          <CardDescription>{new Date(service.date).toLocaleDateString('id-ID')} • {service.km.toLocaleString()} km</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {service.cost ? `Rp ${service.cost.toLocaleString('id-ID')}` : '-'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Tindakan: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(() => {
                              try {
                                const actions = typeof service.actions === 'string' 
                                  ? JSON.parse(service.actions) 
                                  : service.actions || []
                                return actions.map((action: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {action}
                                  </Badge>
                                ))
                              } catch (e) {
                                return <Badge variant="outline" className="text-xs">{service.actions}</Badge>
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            {upcomingReminders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tidak ada reminder aktif</h3>
                  <p className="text-muted-foreground">Semua motor dalam kondisi baik</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingReminders.map((reminder) => (
                  <Card key={reminder.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{reminder.description}</CardTitle>
                          <CardDescription>{reminder.motorcycle.brand} {reminder.motorcycle.model}</CardDescription>
                        </div>
                        <Badge variant={reminder.type === 'km_based' ? 'default' : 'secondary'}>
                          {reminder.type === 'km_based' ? 'Berdasarkan KM' : 'Berdasarkan Waktu'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {reminder.type === 'km_based' && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">KM Saat Ini:</span>
                          <span className="font-medium">
                            {reminder.motorcycle?.currentKm?.toLocaleString() || 'N/A'} / {reminder.dueKm?.toLocaleString() || 'N/A'} km
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}