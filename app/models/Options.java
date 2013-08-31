package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

@SuppressWarnings("serial")
@Entity
public class Options  extends Model{
	@Id
	public Integer id;
	
	@ManyToOne
	public ContactType showMail;
}