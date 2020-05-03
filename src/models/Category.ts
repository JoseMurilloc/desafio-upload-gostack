import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('categorys')
class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
