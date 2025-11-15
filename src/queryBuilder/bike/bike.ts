type RelationConfig = {
    name: string;
    where?: Record<string, any>;
    select?: Record<string, any>;
  };
  
  export class ListBikeQueryBuilder {
    private relations: RelationConfig[] = [];
  
    constructor(private id?: number) {}
  
    // Generic method to add any relation
    addRelation(name: string, options?: { where?: Record<string, any>, select?: Record<string, any> }) {
      this.relations.push({
        name,
        where: options?.where,
        select: options?.select,
      });
      
      return this; 
    }
  
    buildInclude(): Record<string, any> {
      const include: Record<string, any> = {};
      this.relations.forEach((r) => {
        if (r.select) include[r.name] = { select: r.select };
        else if (r.where) include[r.name] = { where: r.where };
        else include[r.name] = true;
      });
      return include;
    }
  
    build(): { where: { id?: number }, include: Record<string, any> } {
      return {
        where: this.id ? { id: this.id } : {},
        include: this.buildInclude(),
      };
    }
  }
  