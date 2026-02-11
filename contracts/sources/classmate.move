module classmate_vault::classmate;
    use sui::event;
    use sui::string::String;

    /// 班级信息
    public struct Classroom has key, store {
        id: UID,
        school: String,
        class_name: String,
        creator: address,
        member_count: u64,
    }

    /// 学生信息（加密存储）
    public struct Student has key, store {
        id: UID,
        classroom_id: address,
        student_address: address,
        encrypted_name: vector<u8>,
        encrypted_student_id: vector<u8>,
        encrypted_contact: vector<u8>,
    }

    /// 创建班级事件
    public struct ClassroomCreated has copy, drop {
        classroom_id: address,
        creator: address,
        school: String,
        class_name: String,
    }

    /// 添加学生事件
    public struct StudentAdded has copy, drop {
        classroom_id: address,
        student_address: address,
    }

    /// 创建新班级
    public fun create_classroom(
        school: String,
        class_name: String,
        ctx: &mut TxContext
    ) {
        let classroom = Classroom {
            id: object::new(ctx),
            school,
            class_name,
            creator: ctx.sender(),
            member_count: 0,
        };

        let classroom_id = object::id_address(&classroom);

        event::emit(ClassroomCreated {
            classroom_id,
            creator: ctx.sender(),
            school: classroom.school,
            class_name: classroom.class_name,
        });

        transfer::share_object(classroom);
    }

    /// 添加学生信息到班级
    public fun add_student(
        classroom: &mut Classroom,
        encrypted_name: vector<u8>,
        encrypted_student_id: vector<u8>,
        encrypted_contact: vector<u8>,
        ctx: &mut TxContext
    ) {
        let student = Student {
            id: object::new(ctx),
            classroom_id: object::id_from_address(object::borrow_id(classroom)),
            student_address: ctx.sender(),
            encrypted_name,
            encrypted_student_id,
            encrypted_contact,
        };

        classroom.member_count = classroom.member_count + 1;

        event::emit(StudentAdded {
            classroom_id: object::id_from_address(object::borrow_id(classroom)),
            student_address: ctx.sender(),
        });

        transfer::share_object(student);
    }

    /// 获取班级成员数量
    public fun get_member_count(classroom: &Classroom): u64 {
        classroom.member_count
    }

    /// 获取班级学校
    public fun get_school(classroom: &Classroom): &String {
        &classroom.school
    }

    /// 获取班级名称
    public fun get_class_name(classroom: &Classroom): &String {
        &classroom.class_name
    }

    /// 获取班级创建者
    public fun get_creator(classroom: &Classroom): address {
        classroom.creator
    }

    /// 获取学生加密信息
    public fun get_student_info(student: &Student): (vector<u8>, vector<u8>, vector<u8>) {
        (student.encrypted_name, student.encrypted_student_id, student.encrypted_contact)
    }

    /// 获取学生所属班级ID
    public fun get_student_classroom_id(student: &Student): address {
        student.classroom_id
    }

    /// 获取学生地址
    public fun get_student_address(student: &Student): address {
        student.student_address
    }
