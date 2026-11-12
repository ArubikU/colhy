'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import type { QuoteJSON } from '@/types/quote-schema';

interface QuoteEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quoteData: QuoteJSON;
    onSave: (data: QuoteJSON) => void;
}

export function QuoteEditModal({ open, onOpenChange, quoteData, onSave }: QuoteEditModalProps) {
    const [formData, setFormData] = useState<QuoteJSON>(quoteData);

    useEffect(() => {
        if (open) {
            setFormData(JSON.parse(JSON.stringify(quoteData)));
        }
    }, [open, quoteData]);

    const handleChange = (field: keyof QuoteJSON, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: keyof QuoteJSON, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { // @ts-ignore
                ...(prev[parent] as any),
                [field]: value
            }
        }));
    };

    const handleArrayChange = (field: keyof QuoteJSON, index: number, value: string) => {
        const newArray = [...(formData[field] as string[])];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field: keyof QuoteJSON) => {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] as string[] || []), ''] }));
    };

    const removeArrayItem = (field: keyof QuoteJSON, index: number) => {
        setFormData(prev => {
            const newArray = [...(prev[field] as string[])];
            newArray.splice(index, 1);
            return { ...prev, [field]: newArray };
        });
    };

    // Generic helper for array of objects (e.g. teamMembers, phases)
    const handleArrayObjectChange = (arrayField: keyof QuoteJSON, index: number, field: string, value: any) => {
        const newArray = [...(formData[arrayField] as any[])];
        newArray[index] = { ...newArray[index], [field]: value };
        setFormData(prev => ({ ...prev, [arrayField]: newArray }));
    };

    const removeArrayObjectItem = (arrayField: keyof QuoteJSON, index: number) => {
        setFormData(prev => {
            const newArray = [...(prev[arrayField] as any[])];
            newArray.splice(index, 1);
            return { ...prev, [arrayField]: newArray };
        });
    };

    // Specific handlers for complex logic
    const handleCostChange = (index: number, field: string, value: any) => {
        const newCosts = [...formData.costBreakdown];
        newCosts[index] = { ...newCosts[index], [field]: value };
        if (field === 'hours' || field === 'hourlyRate') {
            const hours = field === 'hours' ? parseFloat(value) || 0 : newCosts[index].hours;
            const rate = field === 'hourlyRate' ? parseFloat(value) || 0 : newCosts[index].hourlyRate;
            newCosts[index].subtotal = hours * rate;
        }
        setFormData(prev => ({ ...prev, costBreakdown: newCosts }));
    };

    const calculateTotals = () => {
        const subtotal = formData.costBreakdown.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        const taxes = formData.taxes ? { ...formData.taxes, amount: subtotal * (formData.taxes.rate / 100) } : undefined;
        const total = subtotal + (taxes?.amount || 0);

        setFormData(prev => ({
            ...prev,
            subtotal,
            taxes: taxes,
            total
        }));
    };

    const handleSave = () => {
        calculateTotals();
        onSave(formData);
        onOpenChange(false);
    };

    // Tabs shared classes
    const tabTriggerClass = "data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-2";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Editar Cotización Completa</DialogTitle>
                    <DialogDescription>Edita todos los campos disponibles en el esquema.</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <Tabs defaultValue="general" className="h-full flex flex-col">
                        <div className="px-6 pt-2 bg-slate-50 border-b overflow-x-auto">
                            <TabsList className="bg-transparent p-0 gap-2 w-max h-auto">
                                <TabsTrigger value="general" className={tabTriggerClass}>General</TabsTrigger>
                                <TabsTrigger value="entities" className={tabTriggerClass}>Entidades</TabsTrigger>
                                <TabsTrigger value="project" className={tabTriggerClass}>Proyecto</TabsTrigger>
                                <TabsTrigger value="tech_team" className={tabTriggerClass}>Equipo y Tec</TabsTrigger>
                                <TabsTrigger value="plan" className={tabTriggerClass}>Plan</TabsTrigger>
                                <TabsTrigger value="financials" className={tabTriggerClass}>Costos</TabsTrigger>
                                <TabsTrigger value="terms" className={tabTriggerClass}>Términos</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 h-full">
                            {/* GENERAL TAB */}
                            <TabsContent value="general" className="space-y-4 m-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Título del Proyecto</Label>
                                        <Input value={formData.projectTitle} onChange={e => handleChange('projectTitle', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Número de Cotización</Label>
                                        <Input value={formData.quoteNumber} onChange={e => handleChange('quoteNumber', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Fecha de Emisión</Label>
                                        <Input type="date" value={formData.dateIssued} onChange={e => handleChange('dateIssued', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Válido Hasta</Label>
                                        <Input type="date" value={formData.validUntil} onChange={e => handleChange('validUntil', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Moneda</Label>
                                        <Input value={formData.currency} onChange={e => handleChange('currency', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Horas Mínimas</Label>
                                        <Input type="number" value={formData.minimumHours} onChange={e => handleChange('minimumHours', parseFloat(e.target.value))} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* ENTITIES TAB */}
                            <TabsContent value="entities" className="space-y-8 m-0">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">Cliente</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nombre</Label>
                                            <Input value={formData.clientName} onChange={e => handleChange('clientName', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Empresa</Label>
                                            <Input value={formData.clientCompany || ''} onChange={e => handleChange('clientCompany', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={formData.clientEmail || ''} onChange={e => handleChange('clientEmail', e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-2">Consultor</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nombre</Label>
                                            <Input value={formData.consultantName} onChange={e => handleChange('consultantName', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Empresa</Label>
                                            <Input value={formData.consultantCompany || ''} onChange={e => handleChange('consultantCompany', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Input value={formData.consultantEmail || ''} onChange={e => handleChange('consultantEmail', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Teléfono</Label>
                                            <Input value={formData.consultantPhone || ''} onChange={e => handleChange('consultantPhone', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* PROJECT TAB */}
                            <TabsContent value="project" className="space-y-6 m-0">
                                <div className="space-y-2">
                                    <Label>Descripción</Label>
                                    <Textarea value={formData.projectDescription} onChange={e => handleChange('projectDescription', e.target.value)} className="min-h-[100px]" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Alcance</Label>
                                    <Textarea value={formData.projectScope} onChange={e => handleChange('projectScope', e.target.value)} className="min-h-[100px]" />
                                </div>
                                <div className="space-y-3">
                                    <Label>Objetivos</Label>
                                    {formData.objectives.map((obj, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={obj} onChange={e => handleArrayChange('objectives', i, e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeArrayItem('objectives', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => addArrayItem('objectives')}><Plus className="w-4 h-4 mr-2" /> Agregar</Button>
                                </div>
                                <div className="space-y-3">
                                    <Label>Supuestos Clave</Label>
                                    {formData.keyAssumptions.map((item, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={item} onChange={e => handleArrayChange('keyAssumptions', i, e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeArrayItem('keyAssumptions', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => addArrayItem('keyAssumptions')}><Plus className="w-4 h-4 mr-2" /> Agregar</Button>
                                </div>
                                <div className="space-y-3">
                                    <Label>Limitaciones</Label>
                                    {formData.limitations.map((item, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={item} onChange={e => handleArrayChange('limitations', i, e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeArrayItem('limitations', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => addArrayItem('limitations')}><Plus className="w-4 h-4 mr-2" /> Agregar</Button>
                                </div>
                            </TabsContent>

                            {/* TECH & TEAM TAB */}
                            <TabsContent value="tech_team" className="space-y-8 m-0">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Label className="font-semibold block border-b pb-1">Tecnologías</Label>
                                        {formData.technologies.map((item, i) => (
                                            <div key={i} className="flex gap-2"><Input value={item} onChange={e => handleArrayChange('technologies', i, e.target.value)} /><Button variant="ghost" size="icon" onClick={() => removeArrayItem('technologies', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={() => addArrayItem('technologies')}><Plus className="w-4 h-4 mr-2" /> Agregar</Button>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="font-semibold block border-b pb-1">Metodologías</Label>
                                        {formData.methodologies.map((item, i) => (
                                            <div key={i} className="flex gap-2"><Input value={item} onChange={e => handleArrayChange('methodologies', i, e.target.value)} /><Button variant="ghost" size="icon" onClick={() => removeArrayItem('methodologies', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div>
                                        ))}
                                        <Button variant="outline" size="sm" onClick={() => addArrayItem('methodologies')}><Plus className="w-4 h-4 mr-2" /> Agregar</Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between border-b pb-2"><Label className="font-semibold">Miembros del Equipo</Label><Button size="sm" variant="outline" onClick={() => setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, { name: '', role: '' }] }))}><Plus className="w-4 h-4" /></Button></div>
                                    {formData.teamMembers.map((member, i) => (
                                        <div key={i} className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded">
                                            <Input placeholder="Nombre" value={member.name} onChange={e => handleArrayObjectChange('teamMembers', i, 'name', e.target.value)} />
                                            <div className="flex gap-2">
                                                <Input placeholder="Rol" value={member.role} onChange={e => handleArrayObjectChange('teamMembers', i, 'role', e.target.value)} />
                                                <Button variant="ghost" size="icon" onClick={() => removeArrayObjectItem('teamMembers', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between border-b pb-2"><Label className="font-semibold">Firmantes</Label><Button size="sm" variant="outline" onClick={() => setFormData(prev => ({ ...prev, signatories: [...prev.signatories, { name: '', role: '' }] }))}><Plus className="w-4 h-4" /></Button></div>
                                    {formData.signatories.map((sig, i) => (
                                        <div key={i} className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded">
                                            <Input placeholder="Nombre" value={sig.name} onChange={e => handleArrayObjectChange('signatories', i, 'name', e.target.value)} />
                                            <Input placeholder="Rol" value={sig.role} onChange={e => handleArrayObjectChange('signatories', i, 'role', e.target.value)} />
                                            <div className="flex gap-2">
                                                <Input placeholder="ID (DNI/RUC)" value={sig.signerIdentifier || ''} onChange={e => handleArrayObjectChange('signatories', i, 'signerIdentifier', e.target.value)} />
                                                <Button variant="ghost" size="icon" onClick={() => removeArrayObjectItem('signatories', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* PLAN TAB */}
                            <TabsContent value="plan" className="space-y-6 m-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Fecha Inicio Estimada</Label><Input type="date" value={formData.estimatedStartDate} onChange={e => handleChange('estimatedStartDate', e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Fecha Fin Estimada</Label><Input type="date" value={formData.estimatedEndDate} onChange={e => handleChange('estimatedEndDate', e.target.value)} /></div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cronograma (Narrativa)</Label>
                                    <Textarea value={formData.timeline} onChange={e => handleChange('timeline', e.target.value)} className="min-h-[80px]" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b pb-2"><Label className="font-semibold">Fases del Proyecto</Label><Button size="sm" variant="outline" onClick={() => setFormData(prev => ({ ...prev, phases: [...prev.phases, { name: '', description: '', estimatedHours: 0, deliverables: [] }] }))}><Plus className="w-4 h-4" /></Button></div>
                                    {formData.phases.map((phase, i) => (
                                        <div key={i} className="p-3 bg-slate-50 rounded space-y-3 border">
                                            <div className="flex justify-between"><Label className="text-xs font-bold uppercase text-slate-500">Fase {i + 1}</Label><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeArrayObjectItem('phases', i)}><Trash2 className="w-3 h-3 text-red-500" /></Button></div>
                                            <Input placeholder="Nombre Fase" value={phase.name} onChange={e => handleArrayObjectChange('phases', i, 'name', e.target.value)} className="font-medium" />
                                            <Textarea placeholder="Descripción" value={phase.description} onChange={e => handleArrayObjectChange('phases', i, 'description', e.target.value)} />
                                            <div className="flex items-center gap-2"><Label className="text-xs nowrap">Horas Est.</Label><Input type="number" className="w-24" value={phase.estimatedHours} onChange={e => handleArrayObjectChange('phases', i, 'estimatedHours', parseFloat(e.target.value))} /></div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* FINANCIALS TAB */}
                            <TabsContent value="financials" className="space-y-6 m-0">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-slate-100 p-2 rounded">
                                        <span className="font-bold text-lg">Total: {formData.currency} {formData.total.toFixed(2)}</span>
                                        <Button variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, costBreakdown: [...prev.costBreakdown, { category: '', description: '', hours: 0, hourlyRate: 0, subtotal: 0 }] }))}><Plus className="w-4 h-4 mr-2" /> Agregar Costo</Button>
                                    </div>

                                    {formData.costBreakdown.map((item, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 items-end p-2 border-b last:border-0">
                                            <div className="col-span-3"><Label className="text-[10px]">Categoría</Label><Input value={item.category} onChange={e => handleCostChange(i, 'category', e.target.value)} className="h-8 text-sm" /></div>
                                            <div className="col-span-4"><Label className="text-[10px]">Descripción</Label><Input value={item.description} onChange={e => handleCostChange(i, 'description', e.target.value)} className="h-8 text-sm" /></div>
                                            <div className="col-span-2"><Label className="text-[10px]">Horas</Label><Input type="number" value={item.hours} onChange={e => handleCostChange(i, 'hours', parseFloat(e.target.value))} className="h-8 text-sm" /></div>
                                            <div className="col-span-2"><Label className="text-[10px]">Tarifa</Label><Input type="number" value={item.hourlyRate} onChange={e => handleCostChange(i, 'hourlyRate', parseFloat(e.target.value))} className="h-8 text-sm" /></div>
                                            <div className="col-span-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setFormData(prev => { const n = [...prev.costBreakdown]; n.splice(i, 1); return { ...prev, costBreakdown: n }; }); }}><Trash2 className="w-4 h-4 text-red-500" /></Button></div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <Label className="font-semibold">Términos de Pago</Label>
                                    {formData.paymentTerms.map((term, i) => (
                                        <div key={i} className="flex gap-2 mb-2">
                                            <Input type="number" className="w-20" placeholder="%" value={term.percentage} onChange={e => handleArrayObjectChange('paymentTerms', i, 'percentage', parseFloat(e.target.value))} />
                                            <Input className="flex-1" placeholder="Descripción (ej. Al inicio)" value={term.description} onChange={e => handleArrayObjectChange('paymentTerms', i, 'description', e.target.value)} />
                                            <Input type="date" className="w-32" value={term.dueDate || ''} onChange={e => handleArrayObjectChange('paymentTerms', i, 'dueDate', e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeArrayObjectItem('paymentTerms', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, paymentTerms: [...prev.paymentTerms, { percentage: 0, description: '' }] }))}><Plus className="w-4 h-4 mr-2" /> Agregar Término</Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Método de Pago</Label><Input value={formData.paymentMethod} onChange={e => handleChange('paymentMethod', e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Detalles Bancarios</Label><Input value={formData.bankDetails || ''} onChange={e => handleChange('bankDetails', e.target.value)} /></div>
                                </div>
                            </TabsContent>

                            {/* TERMS TAB */}
                            <TabsContent value="terms" className="space-y-6 m-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Garantía</Label><Input value={formData.warrantyPeriod || ''} onChange={e => handleChange('warrantyPeriod', e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Manutención</Label><Input value={formData.maintenanceSupport || ''} onChange={e => handleChange('maintenanceSupport', e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Política de Cancelación</Label><Input value={formData.cancellationPolicy} onChange={e => handleChange('cancellationPolicy', e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Propiedad Intelectual</Label><Input value={formData.intellectualProperty} onChange={e => handleChange('intellectualProperty', e.target.value)} /></div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox id="confidentiality" checked={formData.confidentiality} onCheckedChange={(c) => handleChange('confidentiality', c === true)} />
                                    <Label htmlFor="confidentiality">Incluir Cláusula de Confidencialidad (NDA)</Label>
                                </div>

                                <div className="space-y-2"><Label>Rondas de Revisión</Label><Input type="number" value={formData.revisionRounds || 0} onChange={e => handleChange('revisionRounds', parseFloat(e.target.value))} /></div>

                                <div className="space-y-3">
                                    <Label>Condiciones Especiales</Label>
                                    {(formData.specialConditions || []).map((item, i) => (
                                        <div key={i} className="flex gap-2"><Input value={item} onChange={e => handleArrayChange('specialConditions', i, e.target.value)} /><Button variant="ghost" size="icon" onClick={() => removeArrayItem('specialConditions', i)}><Trash2 className="w-4 h-4 text-red-500" /></Button></div>
                                    ))}
                                    <Button variant="outline" size="sm" onClick={() => addArrayItem('specialConditions')}><Plus className="w-4 h-4 mr-2" /> Agregar</Button>
                                </div>

                                <div className="space-y-2"><Label>Notas</Label><Textarea value={formData.notes || ''} onChange={e => handleChange('notes', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Detalles Extra</Label><Textarea value={formData.extraDetails || ''} onChange={e => handleChange('extraDetails', e.target.value)} /></div>
                            </TabsContent>

                        </div>
                    </Tabs>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-slate-50">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Guardar Cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
