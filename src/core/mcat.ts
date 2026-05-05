export class MCAT {
  private records: any[] = [];

  register(category: string, data: any) {
    const entry = {
      id: `ENT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      category,
      data,
      timestamp: Date.now()
    };
    this.records.push(entry);
    return entry;
  }

  getRecords() {
    return this.records;
  }

  getByCategory(category: string) {
    return this.records.filter(r => r.category === category);
  }
}
