'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wrench, ArrowLeft, Search, Filter, Calendar, MapPin, DollarSign } from 'lucide-react'

export default function HistoryPage() {
  const [motorcycles, setMotorcycles] = useState([])
  const [serviceRecords, setServiceRecords] = useState([])
  const [complaints, setComplaints] = useState([])
  const [reminders, setReminders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [filters, setFilters] = useState({
    motorcycleId: '',
    type: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Cek user login
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(userData))

    // Load data
    loadData(JSON.parse(userData))
  }, [router])

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
        setServiceRecords(servicesData)
      }

      // Load complaints
      const complaintsResponse = await fetch(`/api/complaints?userId=${user.id}`)
      if (complaintsResponse.ok) {
        const complaintsData = await complaintsResponse.json()
        setComplaints(complaintsData)
      }

      // Load reminders
      const remindersResponse = await fetch(`/api/reminders?userId=${user.id}`)
      if (remindersResponse.ok) {
        const remindersData = await remindersResponse.json()
        setReminders(remindersData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredServiceRecords = serviceRecords.filter(record => {
    const matchesMotorcycle = !filters.motorcycleId || record.motorcycleId === filters.motorcycleId
    const matchesSearch = !searchTerm || 
      record.motorcycle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.motorcycle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.actions && typeof record.actions === 'string' && JSON.parse(record.actions).some((action: string) => 
        action.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    return matchesMotorcycle && matchesSearch
  })

  const filteredComplaints = complaints.filter(complaint => {
    const matchesMotorcycle = !filters.motorcycleId || complaint.motorcycleId === filters.motorcycleId
    const matchesSearch = !searchTerm || 
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesMotorcycle && matchesSearch
  })

  const filteredReminders = reminders.filter(reminder => {
    const matchesMotorcycle = !filters.motorcycleId || reminder.motorcycleId === filters.motorcycleId
    const matchesSearch = !searchTerm || 
      reminder.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesMotorcycle && matchesSearch
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
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
              <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Riwayat Lengkap</h1>
                <p className="text-sm text-muted-foreground">Lihat semua catatan dan aktivitas motor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Motor</label>
                <Select value={filters.motorcycleId} onValueChange={(value) => setFilters({...filters, motorcycleId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua motor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua motor</SelectItem>
                    {motorcycles.map((motor: any) => (
                      <SelectItem key={motor.id} value={motor.id}>
                        {motor.brand} {motor.model} - {motor.plateNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Pencarian</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Riwayat Servis ({filteredServiceRecords.length})</TabsTrigger>
            <TabsTrigger value="complaints">Keluhan ({filteredComplaints.length})</TabsTrigger>
            <TabsTrigger value="reminders">Reminder ({filteredReminders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            {filteredServiceRecords.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada riwayat servis</h3>
                  <p className="text-muted-foreground mb-4">Catat servis pertama untuk melacak perawatan motor</p>
                  <Link href="/service/add">
                    <Button>
                      <Wrench className="h-4 w-4 mr-2" />
                      Catat Servis
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredServiceRecords.map((service: any) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{service.motorcycle.brand} {service.motorcycle.model}</CardTitle>
                          <CardDescription className="flex items-center gap-4">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(service.date).toLocaleDateString('id-ID')}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {service.km.toLocaleString()} km
                            </span>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          {service.cost && (
                            <div className="font-semibold flex items-center">
                              <DollarSign className="h-4 w-4" />
                              {service.cost.toLocaleString('id-ID')}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
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
                        
                        {service.spareparts && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Sparepart: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(() => {
                                try {
                                  const spareparts = typeof service.spareparts === 'string' 
                                    ? JSON.parse(service.spareparts) 
                                    : service.spareparts || []
                                  return spareparts.map((sparepart: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {sparepart}
                                    </Badge>
                                  ))
                                } catch (e) {
                                  return null
                                }
                              })()}
                            </div>
                          </div>
                        )}
                        
                        {service.notes && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Catatan: </span>
                            <p className="text-sm mt-1">{service.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="complaints" className="space-y-4">
            {filteredComplaints.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada keluhan</h3>
                  <p className="text-muted-foreground mb-4">Analisis keluhan untuk mendapatkan rekomendasi perbaikan</p>
                  <Link href="/complaint">
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Analisis Keluhan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint: any) => (
                  <Card key={complaint.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{complaint.motorcycle.brand} {complaint.motorcycle.model}</CardTitle>
                          <CardDescription>
                            {new Date(complaint.createdAt).toLocaleDateString('id-ID')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Keluhan: </span>
                          <p className="text-sm mt-1">{complaint.description}</p>
                        </div>
                        
                        {complaint.diagnosis && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Diagnosis: </span>
                            <p className="text-sm mt-1">{complaint.diagnosis}</p>
                          </div>
                        )}
                        
                        {complaint.recommendations && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Rekomendasi: </span>
                            <div className="mt-1">
                              {(() => {
                                try {
                                  const recommendations = typeof complaint.recommendations === 'string' 
                                    ? JSON.parse(complaint.recommendations) 
                                    : complaint.recommendations || []
                                  return recommendations.map((rec: any, index: number) => (
                                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                                      {rec.action || rec}
                                    </Badge>
                                  ))
                                } catch (e) {
                                  return <Badge variant="outline">{complaint.recommendations}</Badge>
                                }
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            {filteredReminders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada reminder</h3>
                  <p className="text-muted-foreground">Reminder akan dibuat otomatis setelah servis</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredReminders.map((reminder: any) => (
                  <Card key={reminder.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{reminder.description}</CardTitle>
                          <CardDescription>{reminder.motorcycle.brand} {reminder.motorcycle.model}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={reminder.isCompleted ? 'secondary' : 'default'}>
                            {reminder.isCompleted ? 'Selesai' : 'Aktif'}
                          </Badge>
                          <Badge variant={reminder.type === 'km_based' ? 'default' : 'secondary'}>
                            {reminder.type === 'km_based' ? 'Berdasarkan KM' : 'Berdasarkan Waktu'}
                          </Badge>
                        </div>
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
                      {reminder.type === 'time_based' && reminder.dueDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Jatuh Tempo:</span>
                          <span className="font-medium">
                            {new Date(reminder.dueDate).toLocaleDateString('id-ID')}
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