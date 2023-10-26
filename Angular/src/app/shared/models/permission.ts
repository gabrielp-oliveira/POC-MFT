/**
 * @author Pradeep. R
 * @email prajendr@cswg.com
 * @createdOn 13/Dec/2022
 * @version 0.1
*/
export class Permission {

  private _canRead: boolean = false;
  get canRead() { return this._canRead; }
  setCanRead(value: boolean): Permission {
    this._canRead = value === true;
    this._cannotRead = value === false;
    return this;
  }

  private _cannotRead: boolean = true;
  get cannotRead() { return this._cannotRead; }


  private _canCreate: boolean = false;
  get canCreate() { return this._canCreate; }
  setCanCreate(value: boolean): Permission {
    this._canCreate = value === true;
    this._cannotCreate = value === false;
    return this;
  }

  private _cannotCreate: boolean = true;
  get cannotCreate() { return this._cannotCreate; }


  private _canEdit: boolean = false;
  get canEdit() { return this._canEdit; }
  setCanEdit(value: boolean): Permission {
    this._canEdit = value === true;
    this._cannotEdit = value === false;
    return this;
  }

  private _cannotEdit: boolean = true;
  get cannotEdit() { return this._cannotEdit; }


  private _canDelete: boolean = false;
  get canDelete() { return this._canDelete; }
  setCanDelete(value: boolean): Permission {
    this._canDelete = value === true;
    this._cannotDelete = value === false;
    return this;
  }

  private _cannotDelete: boolean = true;
  get cannotDelete() { return this._cannotDelete; }


  // --- STATIC-MEMBERS---
  static getInstance() {
    return new Permission()
      .setCanRead(false)
      .setCanCreate(false)
      .setCanEdit(false)
      .setCanDelete(false);
  }


  //---
}