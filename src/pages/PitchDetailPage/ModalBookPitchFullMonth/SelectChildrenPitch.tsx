import { useState } from "react";
import { useGetChildrenPitchsByPitchBookingMonthQuery } from "~/Redux/pitch/pitch.api";
import Loading from "~/components/Loading";
import IChildrentPitch from "~/interfaces/childrentPitch";

interface ISelectChildrenPitch {
  setDataBooking: any;
  dataBooking: any;
  pitchId: string;
}

const SelectChildrenPitch = ({
  setDataBooking,
  dataBooking,
  pitchId,
}: ISelectChildrenPitch) => {
  const [selectedPitch, setSelectedPitch] = useState<number | null>(null);

  const handlePickPitch = (childrentPitch: IChildrentPitch) => {
    if (!childrentPitch?.isBooking) {
      const _dataBooking = [...dataBooking];

      _dataBooking[0] = childrentPitch;
      setDataBooking(_dataBooking);
      setSelectedPitch(childrentPitch.code_chirldren_pitch);
    }
  };

  const { data, isFetching } =
    useGetChildrenPitchsByPitchBookingMonthQuery(pitchId);

  return (
    <>
      <h2 className="text-xl font-medium leading-3">Chọn sân đá</h2>
      <hr className="my-3" />
      {isFetching ? (
        <div className="flex align-center mt-[80px] justify-center">
          <Loading />
        </div>
      ) : (
        ""
      )}
      <div className="grid grid-cols-2 gap-6">
        {data?.data.map((childrentPitch: any) => (
          <div
            key={childrentPitch._id}
            onClick={() => handlePickPitch(childrentPitch)}
            className={`rounded-[10px] shadow-md overflow-hidden h-[180px] ${
              childrentPitch?.isBooking
                ? "cursor-default"
                : "hover:opacity-90 hover:shadow-xl cursor-pointer"
            }`}
          >
            <h3
              className={`bg-[#1fd392] text-center p-[4px] text-[18px] font-medium ${
                childrentPitch?.isBooking ? "bg-red-500" : ""
              } ${
                selectedPitch === childrentPitch.code_chirldren_pitch
                  ? "bg-[#e6f4ff]"
                  : ""
              }`}
            >
              Sân {childrentPitch.code_chirldren_pitch}
            </h3>
            <img
              src="http://res.cloudinary.com/dwp7umncy/image/upload/v1698472712/datn-img/wf48fo9qkwrka4icasrz.jpg"
              className="aspect-video object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default SelectChildrenPitch;
